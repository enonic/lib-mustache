package com.enonic.lib.mustache;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.samskivert.mustache.Mustache;
import com.samskivert.mustache.MustacheException;
import com.samskivert.mustache.Template;

import jdk.nashorn.api.scripting.AbstractJSObject;

import com.enonic.xp.resource.Resource;
import com.enonic.xp.resource.ResourceKey;
import com.enonic.xp.resource.ResourceProblemException;
import com.enonic.xp.resource.ResourceService;
import com.enonic.xp.script.ScriptValue;
import com.enonic.xp.trace.Trace;
import com.enonic.xp.trace.Tracer;

public final class MustacheProcessor
{
    private final Mustache.Compiler compiler;

    private ResourceKey view;

    private ScriptValue model;

    private ResourceService resourceService;

    public MustacheProcessor( final Mustache.Compiler compiler )
    {
        this.compiler = compiler;
    }

    public void setView( final ResourceKey view )
    {
        this.view = view;
    }

    public void setModel( final ScriptValue model )
    {
        this.model = model;
    }

    public String process()
    {
        final Trace trace = Tracer.newTrace( "mustache.render" );
        if ( trace == null )
        {
            return execute();
        }

        return Tracer.trace( trace, () -> {
            trace.put( "path", this.view.getPath() );
            trace.put( "app", this.view.getApplicationKey().toString() );
            return execute();
        } );
    }

    public String execute()
    {
        try
        {
            return doExecute();
        }
        catch ( final RuntimeException e )
        {
            throw handleError( e );
        }
    }

    public void setResourceService( final ResourceService resourceService )
    {
        this.resourceService = resourceService;
    }

    private String doExecute()
    {
        final Resource resource = resourceService.getResource( this.view );
        final Template template = this.compiler.compile( resource.readString() );

        final Map<Object, Object> hash = createHashFromModel();
        return template.execute( hash );
    }

    private RuntimeException handleError( final RuntimeException e )
    {
        if ( e instanceof MustacheException.Context )
        {
            return handleError( (MustacheException.Context) e );
        }

        return e;
    }

    private RuntimeException handleError( final MustacheException.Context e )
    {
        return ResourceProblemException.create().
            lineNumber( e.lineNo ).
            resource( this.view ).
            cause( e ).
            message( e.getMessage() ).
            build();
    }

    private Map<Object, Object> createHashFromModel()
    {
        final Map<String, Object> map = this.model == null ? Map.of() : this.model.getMap();
        final Map<Object, Object> hash = new HashMap<>();
        for ( Map.Entry<String, Object> entry : map.entrySet() )
        {
            final Object value = entry.getValue();
            if ( value instanceof Function )
            {
                Mustache.Lambda lambda = createLambdaFromFunction( (Function) value );
                hash.put( entry.getKey(), lambda );
            }
            else
            {
                hash.put( entry.getKey(), value );
            }
        }
        return hash;
    }

    private Mustache.Lambda createLambdaFromFunction( final Function value )
    {
        return ( frag, out ) -> {
            Object inner = value.apply( null );
            if (inner instanceof Function) {
                final Function<Object, Object[]> function = (Function<Object, Object[]>) inner;
                final Object rendered = function.apply( new Object[]{frag.decompile(), new RenderFunction( frag.context() )} );
                if ( rendered != null )
                {
                    out.write( rendered.toString() );
                }
            } else {
                throw new IllegalStateException("Lambda must be a function");
            }
        };
    }

    private class RenderFunction
        extends AbstractJSObject
    {
        final Object context;

        RenderFunction( final Object context )
        {
            this.context = context;
        }

        @Override
        public Object call( final Object thiz, final Object... args )
        {
            final String text = (String) args[0];
            return compiler.compile( text ).execute( context );
        }

        @Override
        public boolean isFunction()
        {
            return true;
        }
    }
}
