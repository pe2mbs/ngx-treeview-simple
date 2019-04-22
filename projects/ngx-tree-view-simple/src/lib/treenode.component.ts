import { Component, 
         Input } from '@angular/core';
import { BaseTreeView, 
         TreeData, 
         EventData, 
         DoubleClick, 
         DropPosition } from './treeview';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'node',
    templateUrl: './treenode.component.html',
    styleUrls: [ './treenode.component.scss' ]
})
export class NodeComponent<T> extends BaseTreeView<T>
{
    @Input()    data!:      TreeData<T>;
    @Input()    last!:      boolean;
    @Input()    path!:      number[];
    private     hovered     = false;
    private     doubleClick = new DoubleClick();
  
    constructor() 
    {
        super( 'NodeComponent' );
        return;
    }

    public get nodeClassName() 
    {
        return ( super.getNodeClassName( this.data, this.last ) ); 
    }
  
    public get anchorClassName() 
    {
        return ( super.getAnchorClassName( this.data, this.hovered, this.path ) );
    }
  
    public get checkboxClassName() 
    {
        return ( super.getCheckboxClassName( this.data, this.path ) );
    }
  
    public get iconClassName() 
    {
        return ( super.getIconClassName( this.data.icon ) );
    }
  
    public get oclClassName() 
    {
        return ( super.getOclClassName( this.path ) );
    }
  
    public get pathString() 
    {
        return ( this.path.toString() );
    }
  
    public get hasMarker() 
    {
        return ( this.config !== undefined && this.config.draggable && 
                 this.data.state.dropPosition !== DropPosition.empty );
    }
  
    public get markerClassName() 
    {
        return ( super.getMarkerClassName( this.data ) );
    }
  
    private get eventData(): EventData<T> 
    {
        return ( { data: this.data, path: this.path } );
    }
    public get id() 
    {
        return ( super.getId( this.path, this.config !== undefined ? 
                                            this.config.preid :
                                            '' ) );
    }
  
    public getChildPath( index: number ) 
    {
        return ( this.path.concat( index ) );
    }
  
    public hover( hovered: boolean ): void
    {
        this.hovered = hovered;
        return;
    }

    public onToggle( eventData?: EventData<T> ): void 
    {
        console.log( 'NodeComponent.onToggle' );
        if ( eventData )  
        {
            this.toggle.emit( eventData );
        } 
        else 
        {
            if ( this.data.state.openable || this.data.children.length > 0 ) 
            {
                this.toggle.emit( this.eventData );
            }
        }
        return;
    }

    public onChange( eventData?: EventData<T> ): void
    {
        if ( eventData ) 
        {
            this.change.emit( eventData );
        } 
        else 
        {
            if ( this.data.state.disabled ) 
            {
                return;
            }
            this.doubleClick.onclick(() => {
                this.change.emit( this.eventData );
            } );
        }
        return;
    }

    public trackBy( request: TreeData, index: number ) 
    {
        return ( index );
    }
}
