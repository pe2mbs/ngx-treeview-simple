import { rawExtraData } from './demo';
import { Input, Output, EventEmitter, OnInit } from '@angular/core';


export interface TreeData<T = any>  
{
    text?: string;
    value?: T;
    icon?: string | false;
    state: TreeNodeState;
    children: TreeData<T>[];
    contextmenu?: string | Function;
    component?: string | Function;
}
  
export interface TreeNodeState 
{
    opened: boolean;
    selected: boolean;
    disabled: boolean;
    loading: boolean;
    highlighted: boolean;
    openable: boolean;
    dropPosition: DropPosition;
    dropAllowed: boolean;
}

export interface EventData<T = any> 
{
    data: TreeData<T>;
    path: number[];
}

export interface ContextMenuData<T = any> 
{
    data: TreeData<T>;
    path: number[];
    root: TreeData<T>[];
    parent?: any;
}

export interface DragTargetData<T = any> 
{
    root: TreeData<T>[];
    target: HTMLElement;
}

export interface Data 
{
    text?: string;
    value?: Value;
    icon?: string | false;
    state?: Partial<TreeNodeState>;
    children?: Data[];
    component?: string | Function;
}

export interface Value  
{
    id: number;
}

export const enum DropPosition 
{
    empty,
    up,
    inside,
    down
}

export interface DropData<T = any> 
{
    sourceData: TreeData<T>;
    sourcePath: number[];
    sourceRoot: TreeData<T>[];
    targetData: TreeData<T>;
    targetPath: number[];
}

export class TreeConfig<T>
{
    private _theme:         string;
    private _size:          string;
    private _noDots:        boolean;
    private _checkbox:      boolean;
    private _preid:         string;
    private _draggable:     boolean;
    private _multiselect:   boolean;

    constructor( theme: string = 'default', size: string = '', no_dots = false )
    {
        this._theme         = theme;
        this._size          = size;
        this._noDots        = no_dots;
        this._checkbox      = false;
        this._preid         = '';
        this._draggable     = false; 
        this._multiselect   = false;
        console.log( `theme: "${ this._theme }" size: "${ this._size }"` );
        return;
    }

    public get rootClassName()
    {
        if ( this._size ) 
        {
            return ( `tv-${ this._theme }-${ this._size }` );
        } 
        return ( `tv-${ this._theme }` );
    }

    public get theme(): string
    {
        return ( this._theme );
    }

    public get size(): string
    {
        return ( this._size );
    }

    public get noDots(): boolean
    {
        return ( this._noDots );
    }

    public get checkbox(): boolean
    {
        return ( this._checkbox );
    }

    public set checkbox( value: boolean )
    {
        this._checkbox = value;
        return;
    }

    public get preid(): string
    {
        return ( this._preid );
    }

    public set preid( value: string )
    {
        this._preid = value;
        return;
    }

    public get draggable(): boolean
    {
        return ( this._draggable );
    }

    public set draggable( value: boolean )
    {
        this._draggable = value;
        return;
    }

    public get multiselect(): boolean
    {
        return ( this._multiselect );
    }

    public set multiselect( value: boolean )
    {
        this._multiselect = value;
        return;
    }
}

export class DoubleClick 
{
    private clicked = false;
    private timer: null | any = null;

    constructor( private timeout = 300 ) 
    { 
        return;
    }

    public onclick(singleClick: () => void) 
    {
        if ( !this.clicked ) 
        {
            this.clicked = true;
            singleClick();
            this.timer = setTimeout(() => {
                this.clicked = false;
            }, this.timeout );
        } 
        else 
        {
            this.clicked = false;
            if ( this.timer ) 
            {
                clearTimeout( this.timer );
                this.timer = null;
            }
        }
        return;
    }
}

export class BaseTreeView<T>
{
    protected   className: string;
    @Input()    config:         TreeConfig<T>;
    @Output()   toggle      = new EventEmitter<EventData<T>>();
    @Output()   change      = new EventEmitter<EventData<T>>();

    constructor( class_name: string ) 
    {
        this.className = class_name;
        return;
    }

    protected updateTree( treeData ): void
    {
        treeData.forEach( element => {
            if ( element.state.opened === true )
            {
                element.icon = 'fa fa-folder-open-o';
                element.state.highlighted = true;
            }
            else if ( element.icon !== undefined && element.icon.startsWith( 'fa fa-folder' ) )
            {
                element.state.highlighted = false;
                element.icon = 'fa fa-folder-o';
            }
            if ( element.children !== undefined )
            {
                this.updateTree( element.children );
            }
        }); 
        return treeData;
    }   

    public get themeClassName(): string
    {
        if ( this.config === undefined )
        {
            return ( '' );
        }
        return ( this.config.rootClassName ); 
    } 
    
    public get containerClassName() 
    {
        const values = [ 'tree-container-ul', 
                         'tree-children' ];
        if ( this.config.noDots ) 
        {
            values.push( 'tree-no-dots' );
        }
        return ( values.join( ' ' ) );
    }

    protected getNodeClassName( data: TreeData<T>, last: boolean ) 
    {
        const values = [ 'tree-node' ];
        if ( data.state.openable || data.children.length > 0 ) 
        {
            if ( data.state.opened ) 
            {
                values.push( 'tree-open' );
            } 
            else if ( !data.state.loading )
            {
                values.push( 'tree-closed' );
            }
            else
            {
                values.push( 'tree-loading' );
            }
        } 
        else 
        {
            values.push( 'tree-leaf' );
        }
        if ( last ) 
        {
            values.push( 'tree-last' );
        }
        return ( values.join( ' ' ) );
    }

    protected getAnchorClassName( data: TreeData<T>, hovered: boolean, path: number[] ) 
    {
        const values = [ 'tree-anchor', 
                         'tree-relative', 
                         `tree-anchor-${path.join('-')}` ];
        if ( data.state.selected ) 
        {
            values.push( 'tree-clicked' );
        }
        if ( data.state.disabled ) 
        {
            values.push( 'tree-disabled' );
        }
        if ( data.state.highlighted ) 
        {
            values.push( 'tree-search' );
        }
        if ( hovered ) 
        {
            values.push( 'tree-hovered' );
        }
        return ( values.join( ' ' ) );
    }

    protected getCheckboxClassName( data: TreeData<T>, path: number[] ) 
    {
        const values = [ 'tree-icon', 
                         'tree-checkbox', 
                         `tree-checkbox-${path.join('-')}` ];
        if ( data.children && 
             data.children.some( child => child.state.selected ) && 
             data.children.some( child => !child.state.selected ) ) 
        {
            values.push( 'tree-undetermined' );
        }
        return ( values.join( ' ' ) );
    }

    public get rootClassName() 
    {
        const values = [ this.themeClassName ];
        if ( this.config !== undefined && this.config.checkbox ) 
        {
            values.push( 'tree-checkbox-selection' );
            // , 'tree-checkbox-no-clicked'
        }
        return ( values.join( ' ' ) );
    }

    protected getIconClassName( icon: string | false | undefined ) 
    {
        const values = [ 'tree-icon', 
                         'tree-themeicon' ];
        if ( icon ) 
        {
            values.push( 'tree-themeicon-custom', icon );
        }
        return ( values.join( ' ' ) );
    }

    protected getOclClassName( path: number[] ) 
    {
        return ( [ 'tree-icon', 
                   'tree-ocl', 
                   `tree-ocl-${path.join('-')}` ].join( ' ' ) );
    }

    protected getMarkerClassName( data: TreeData<T> ) 
    {
        const values = [ `tree-marker-${data.state.dropPosition}` ];
        if ( data.state.dropAllowed ) 
        {
            values.push( 'allowed' );
        } 
        else 
        {
            values.push( 'not-allowed' );
        }
        return ( values.join( ' ' ) );
    }

    public getNodeFromPath( rootData: TreeData<T>[], path: number[] ): TreeData<T> | null
    {
        let node: TreeData<T> | null = null;
        for ( const index of path ) 
        {
            node = node ? node.children[ index ] : rootData[ index ];
        }
        return ( node );
    }

    protected getGlobalOffset( dropTarget: HTMLElement ): number
    {
        let offset = 0;
        let currentElem = dropTarget;
        while ( currentElem ) 
        {
            offset += currentElem.offsetTop;
            currentElem = currentElem.offsetParent as HTMLElement;
        }
        return ( offset );
    }

    protected getDropPosition( pageY: number, offsetTop: number, offsetHeight: number ) 
    {
        const top = pageY - offsetTop;
        if ( top < offsetHeight / 3 ) 
        {
            return ( DropPosition.up );
        } 
        else if ( top > offsetHeight * 2 / 3 ) 
        {
            return ( DropPosition.down );
        } 
        return ( DropPosition.inside );
    }

    protected clearDropPositionOfTree( tree: TreeData<T> ) 
    {
        if ( tree.state.dropPosition ) 
        {
            tree.state.dropPosition = DropPosition.empty;
        }
        if ( tree.children ) 
        {
            for ( const child of tree.children )  
            {
                this.clearDropPositionOfTree( child );
            }
        }
        return;
    }

    protected doDrag( pageY: number, 
                      dragTarget: HTMLElement | null | undefined, 
                      dropTarget: HTMLElement | null, 
                      dragTargetRoot: TreeData<T>[], 
                      dropTargetRoot: TreeData<T>[], 
                      dropAllowed?: ( dropData: DropData<T> ) => boolean, next?: () => void ): void 
    {
        if ( dropTarget && dragTarget ) 
        {
            // tslint:disable-next-line:no-non-null-assertion
            const sourcePath = dragTarget.dataset.path!.split(',').map( s => +s );
            const dropTargetPathString = dropTarget.dataset.path;
            if (dropTargetPathString) 
            {
                const targetPath = dropTargetPathString.split(',').map( s => +s );
                // tslint:disable-next-line:no-non-null-assertion
                const targetData = this.getNodeFromPath( dropTargetRoot, targetPath )!;
                // tslint:disable-next-line:no-non-null-assertion
                const sourceData = this.getNodeFromPath( dragTargetRoot, sourcePath )!;
                const offsetTop = this.getGlobalOffset( dropTarget );
                const position = this.getDropPosition( pageY, 
                                                offsetTop, 
                                                dropTarget.offsetHeight );
                if ( targetData.state.dropPosition !== position )  
                {
                    targetData.state.dropPosition = position;
                    const dropData: DropData<T> = {
                        sourcePath,
                        targetPath,
                        sourceData,
                        targetData,
                        sourceRoot: dragTargetRoot
                    };
                    targetData.state.dropAllowed = dropAllowed ? dropAllowed( dropData ) : true;
                    if ( next ) 
                    {
                        next();
                    }
                }
            }
        }
        return;
    }

    protected doDragLeave( target: HTMLElement, data: TreeData<T>[] ): void
    {
        const pathString = target.dataset.path;
        if ( pathString ) 
        {
            const path = pathString.split( ',' ).map( s => +s );
            const node = this.getNodeFromPath( data, path );
            // tslint:disable-next-line:no-non-null-assertion
            if ( node!.state.dropPosition !== DropPosition.empty ) 
            {
                // tslint:disable-next-line:no-non-null-assertion
                node!.state.dropPosition = DropPosition.empty;
            }
        }
        return;
    }

    protected doDrop( target: HTMLElement, 
                      dragTarget: HTMLElement | null | undefined, 
                      dragTargetRoot: TreeData<T>[], 
                      dropTargetRoot: TreeData<T>[], 
                      next: ( dropData: DropData<T> ) => void ): void
    {
        console.log( 'dragTarget: ', dragTarget );
        if ( dragTarget ) 
        {
            // tslint:disable-next-line:no-non-null-assertion
            const sourcePath = dragTarget.dataset.path!.split( ',' ).map( s => +s );
            const targetPathString = target.dataset.path;
            console.log( 'targetPathString: ', targetPathString );
            if ( targetPathString ) 
            {
                const targetPath = targetPathString.split( ',' ).map( s => +s );
                // tslint:disable-next-line:no-non-null-assertion
                const targetData = this.getNodeFromPath( dropTargetRoot, 
                                                         targetPath )!;
                // tslint:disable-next-line:no-non-null-assertion
                const sourceData = this.getNodeFromPath( dragTargetRoot, 
                                                         sourcePath )!;
                console.log( 'dropPosition: ', 
                             targetData.state.dropPosition !== DropPosition.empty );
                if ( targetData.state.dropPosition !== DropPosition.empty ) 
                {
                    const dropData: DropData<T> = {
                        sourcePath,
                        targetPath,
                        sourceData,
                        targetData,
                        sourceRoot: dragTargetRoot
                    };
                    console.log( 'dropData: ', dropData );
                    next( dropData );
                }
            }
        }
        for ( const node of dropTargetRoot ) 
        {
            this.clearDropPositionOfTree( node );
        }
        return;
    }

    protected clearMarkerOfTree( tree: TreeData<T> ): void 
    {
        if ( tree.state.dropPosition !== DropPosition.empty ) 
        {
            tree.state.dropPosition = DropPosition.empty;
        }
        if ( tree.children ) 
        {
            for ( const child of tree.children ) 
            {
                this.clearMarkerOfTree( child );
            }
        }
        return;
    }

    public setSelectionOfTree( tree: TreeData<T>, selected: boolean ) 
    {
        if ( tree.state.selected !== selected ) 
        {
            tree.state.selected = selected;
        }
        if ( tree.children ) 
        {
            for ( const child of tree.children ) 
            {
                this.setSelectionOfTree( child, selected );
            }
        }
        return;
    }

    public clearSelectionOfTree( tree: TreeData<T> ): void 
    {
        if ( tree.state.selected ) 
        {
            tree.state.selected = false;
        }
        if ( tree.children ) 
        {
            for ( const child of tree.children ) 
            {
                this.clearSelectionOfTree( child );
            }
        }
        return;
    }

    protected getId( path: number[], preid?: string ): string | undefined 
    {
        return ( preid ? preid + path.join( '-' ) : undefined );
    }

    public doChange( eventData: EventData<T>,
                     tree: TreeData<T>[] )
    {
        if ( !this.config.multiselect )
        {
            if ( !eventData.data.state.selected )  
            {
                for ( const child of tree ) 
                {
                    this.clearSelectionOfTree( child );
                }
            }
        }
        eventData.data.state.selected = !eventData.data.state.selected;    
        if ( this.config.checkbox && eventData.data.children.length > 0 )
        {
            if ( this.config.multiselect )
            {
                if ( eventData.data.state.selected )  
                {
                    for ( const child of eventData.data.children ) 
                    {
                        this.setSelectionOfTree( child, true );
                    }
                }
                else
                {
                    for ( const child of eventData.data.children ) 
                    {
                        this.setSelectionOfTree( child, false );
                    }
                }
            }
        }
    }

    private correctFolder( eventData: EventData<T> )
    {
        if ( eventData.data.state.opened === true )
        {
            eventData.data.icon = 'fa fa-folder-open-o';
            eventData.data.state.highlighted = true;
        }
        else
        {
            eventData.data.state.highlighted = false;
            eventData.data.icon = 'fa fa-folder-o';
        }
    }


    public doToggle( eventData: EventData<T>, 
                     customComponent?: string | Function, next?: () => void ) 
    {
        console.log( 'doToggle' );
        if ( !eventData.data.state.opened && 
             eventData.data.children.length === 0 ) 
        {
            eventData.data.state.loading = true;
            setTimeout( () => {
                const newExtraData: TreeData[] = JSON.parse( 
                                JSON.stringify( rawExtraData ) );
                eventData.data.children = newExtraData;
                if ( customComponent ) 
                {
                    newExtraData[ 5 ].component = customComponent;
                }
                eventData.data.state.loading = false;
                eventData.data.state.opened = !eventData.data.state.opened;
                this.correctFolder( eventData );
                if ( next ) 
                {
                    next();
                }
            }, 500 );
        } 
        else 
        {
            eventData.data.state.opened = !eventData.data.state.opened;
        }
        this.correctFolder( eventData );
        if ( next ) 
        {
            next();
        }
        return;
    }

    protected setContextMenu( tree: TreeData<T>, component: string | Function ) 
    {
        tree.contextmenu = component;
        if ( tree.children ) 
        {
            for ( const child of tree.children ) 
            {
                this.setContextMenu( child, component );
            }
        }
        return;
    }

    protected setParentsSelection( tree: TreeData<T>[], path: number[] ) 
    {
        const parents: TreeData<T>[] = [];
        const parentPath = path.slice( 0, path.length - 1 );
        for ( const index of parentPath ) 
        {
            if ( parents.length === 0 ) 
            {
                parents.unshift( tree[ index ] );
            } 
            else 
            {
                parents.unshift( parents[ 0 ].children[ index ] );
            }
        }
        for ( const parent of parents ) 
        {
            parent.state.selected = parent.children.every( child => child.state.selected );
        }
        return;
    }

    protected canMove( dropData: DropData<T> ) 
    {
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

    protected doMove( dropData: DropData<T>, treeData: TreeData<T>[] ) 
    {
        if ( !this.canMove( dropData ) ) 
        {
            return;
        }
        const sourceParent = this.getNodeFromPath( treeData, 
                dropData.sourcePath.slice( 0, dropData.sourcePath.length - 1 ) );
        const sourceChildren = ( sourceParent && sourceParent.children ? 
                sourceParent.children : treeData );
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
            const targetParent = this.getNodeFromPath( treeData, 
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
}
