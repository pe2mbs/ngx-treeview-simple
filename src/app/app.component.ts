import { Component, ViewChild } from '@angular/core';
import { EventData, Value, TreeConfig, DropData, TreeData, DropPosition, DragTargetData } from 'library/treeview/treeview';
import { data } from 'library/treeview/demo';
import { TreeComponent } from 'library/treeview/tree.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent
{
    @ViewChild( 'tvDemo' )    treeView: TreeComponent<Value>;    
    dropAllowed                         = this.canMove;
    dragTarget: DragTargetData | null   = null;
    data = data as any;
    selectedId: number | null = null;
    public config: TreeConfig<Value>; 

    constructor() 
    { 
        this.config = new TreeConfig<Value>();
        this.config.checkbox = false;
        this.config.multiselect = false;
        this.config.draggable = true;
        return;
    }

    onToggle( eventData: EventData<Value> ) 
    {
        console.log( 'AppComponent.onToggle' );
        this.treeView.doToggle( eventData );
    }

    onChange( eventData: EventData<Value> ) 
    {
        console.log( 'Select: ', eventData );
        this.selectedId = eventData.data.state.selected ? null : eventData.data.value.id;
        this.treeView.doChange( eventData, this.data );
        return;
    }

    drop( dropData: DropData<Value> ): void
    {
        this.move( dropData, this.data );
        return;
    }

    move( dropData: DropData<Value>, treeData: TreeData<Value>[] ): void 
    {
        if ( this.canMove( dropData ) === false ) 
        {
            console.log( 'not moving' ); 
            return;
        }
        const sourceParent = this.treeView.getNodeFromPath( treeData, 
            dropData.sourcePath.slice( 0, dropData.sourcePath.length - 1 ) );
        const sourceChildren = ( sourceParent && sourceParent.children ? 
                  sourceParent.children : 
                  treeData );
        let sourceIndex = dropData.sourcePath[ dropData.sourcePath.length - 1 ];
        if ( dropData.targetData.state.dropPosition === DropPosition.inside ) 
        {
            if ( dropData.targetData.children ) 
            {
                dropData.targetData.children.push( dropData.sourceData );
            } 
            else 
            {
                dropData.targetData.children = [ dropData.sourceData ];
            }
            dropData.targetData.state.opened = true;
        } 
        else 
        {
            const startIndex = dropData.targetPath[ dropData.targetPath.length - 1 ] +
                    ( dropData.targetData.state.dropPosition === DropPosition.up ? 0 : 1 );
            const targetParent = this.treeView.getNodeFromPath( treeData, 
                    dropData.targetPath.slice( 0, dropData.targetPath.length - 1 ) );
            const targetChildren = targetParent && targetParent.children ? targetParent.children : treeData;
            targetChildren.splice( startIndex, 0, dropData.sourceData );

            if ( targetChildren === sourceChildren && startIndex < sourceIndex ) 
            {
                sourceIndex++;
            }
        }
        sourceChildren.splice( sourceIndex, 1 );
        return;
    }

    canMove( dropData: DropData<Value> ): boolean
    {
        /*
        if ( !dropData.targetData.icon.startsWith( 'fa fa-folder' ) )
        {
            console.log( 'cannot move' );
            return ( false );
        }
        */
        console.log( 'canMove', dropData );
        if ( dropData.targetPath.length < dropData.sourcePath.length ) 
        {
            return ( true );
        }
        for ( let i = 0; i < dropData.sourcePath.length; i++ ) 
        {
            if ( dropData.targetPath[ i ] !== dropData.sourcePath[ i ] ) 
            {
                return ( true );
            }
        }
        return ( dropData.targetData.state.dropPosition !== DropPosition.inside && 
                dropData.targetPath.length === dropData.sourcePath.length );
    }

    changeDragTarget( dragTarget: DragTargetData | null ): void
    {
        this.dragTarget = dragTarget;
        return;
    }
    
}
