import { Component, 
         Input, 
         Output, 
         EventEmitter, 
         OnInit } from '@angular/core';
import { TreeData, 
         DropData, 
         DragTargetData, 
         EventData, 
         BaseTreeView } from './treeview';

@Component( {
    // tslint:disable-next-line:component-selector
    selector: 'tree',
    templateUrl: './tree.component.html',
    styleUrls: [ './tree.component.scss' ]
} )
export class TreeComponent<T> extends BaseTreeView<T> implements OnInit
{
    @Input()    data!:          TreeData<T>[];
    @Input()    dropAllowed?:   ( dropData: DropData<T> ) => boolean;
    @Input()    dragTarget?:    DragTargetData | null;
    
    @Output()   drop               = new EventEmitter<DropData<T>>();
    @Output()   changeDragTarget   = new EventEmitter<DragTargetData>();
  
    private     localDragTarget: HTMLElement | null = null;
    private     dropTarget: HTMLElement | null = null;

    constructor() 
    {
        super( 'TreeComponent' );
        return;
    }

    ngOnInit()
    {
        this.updateTree( this.data );
        return;
    }

    public get containerClassName() 
    {
        const values = [ 'root-container-ul', 
                         'root-children' ];
        if ( this.config.noDots ) 
        {
            values.push( 'root-no-dots' );
        }
        return ( values.join( ' ' ) );
    }

    public onToggle( eventData: EventData<T> ): void
    {
        console.log( 'TreeComponent.onToggle' );
        this.toggle.emit( eventData );
        return;
    }

    public onChange( eventData: EventData<T> ): void
    {
        this.change.emit( eventData );
        return;
    }

    public onDragStart( event: DragEvent ): void
    {
        if ( !this.config.draggable ) 
        {
            return;
        }
        console.log( 'onDragStart', event );
        this.localDragTarget = event.target as HTMLElement;
        this.dropTarget = event.target as HTMLElement;
        this.changeDragTarget.emit( {
            target: event.target as HTMLElement,
            root: this.data
        } );
        return;
    }

    public onDragEnd( event: DragEvent ) 
    {
        if ( !this.config.draggable ) 
        {
            return;
        }
        console.log( 'onDragEnd', event );
        this.localDragTarget = null;
        for ( const tree of this.data ) 
        {
            super.clearMarkerOfTree( tree );
        }
        this.changeDragTarget.emit( null );
        return;
    }

    public onDragOver( event: DragEvent ) 
    {
        if ( !this.config.draggable ) 
        {
            return;
        }
        console.log( 'onDragOver', event );
        if ( !this.canDrop( event ) ) 
        {
            return;
        }
        if ( this.dragTarget ) 
        {
            super.doDrag( event.pageY, 
                           this.dragTarget.target, 
                           this.dropTarget, 
                           this.dragTarget.root, 
                           this.data, 
                           this.dropAllowed );
        } 
        else 
        {
            super.doDrag( event.pageY, 
                           this.localDragTarget, 
                           this.dropTarget, 
                           this.data, 
                           this.data, 
                           this.dropAllowed );
        }
        event.preventDefault();
        return;
    }

    public onDragEnter( event: DragEvent ): void
    {
        if ( !this.config.draggable ) 
        {
            return;
        }
        console.log( 'onDragEnter', event );
        if ( !this.canDrop( event ) ) 
        {
            return;
        }
        this.dropTarget = event.target as HTMLElement;
        if ( this.dragTarget ) 
        {
            super.doDrag( event.pageY, 
                           this.dragTarget.target, 
                           this.dropTarget, 
                           this.dragTarget.root, 
                           this.data, 
                           this.dropAllowed );
        } 
        else 
        {
            super.doDrag( event.pageY, 
                           this.localDragTarget, 
                           this.dropTarget, 
                           this.data, 
                           this.data, 
                           this.dropAllowed );
        }
        return;
    }

    public onDragLeave( event: DragEvent ): void
    {
        if ( !this.config.draggable ) 
        {
            return;
        }
        console.log( 'onDragLeave', event );
        if ( !this.canDrop( event ) ) 
        {
            return;
        }
        if ( event.target === this.dropTarget )
        {
            this.dropTarget = null;
        }
        super.doDragLeave( event.target as HTMLElement, this.data );
        return;
    }

    public onDrop( event: DragEvent ) 
    {
        if ( !this.config.draggable ) 
        {
            return;
        }
        console.log( 'onDrop', event );
        event.stopPropagation();
        if ( !this.canDrop( event ) ) 
        {
            return;
        }
        if ( this.dragTarget ) 
        {
            super.doDrop( event.target as HTMLElement, 
                           this.dragTarget.target, 
                           this.dragTarget.root, 
                           this.data, dropData => {
                this.drop.emit( dropData );
            } );
        } 
        else 
        {
            super.doDrop( event.target as HTMLElement, 
                           this.localDragTarget, 
                           this.data, 
                           this.data, 
                           dropData => {
                this.drop.emit( dropData );
            } );
        }
        return;
    }

    public trackBy( request: TreeData, index: number ): number 
    {
        return ( index );
    }

    private canDrop( event: DragEvent ): boolean
    {
        const mayDrop: boolean = this.config.draggable === true && 
                                 event.target != null && 
                                 (event.target as HTMLElement).dataset != null && 
                                 (event.target as HTMLElement).dataset.path != null;
        console.log( 'canDrop: ', event, 'mayDrop: ', mayDrop );
        return ( mayDrop );
    }
}
