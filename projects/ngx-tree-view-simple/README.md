# TreeView component Angular 2.x

This TreeView heavly based on the tree-component of York Yao. But as this 
is a component that is for multi frameworks. I liked the look and feel of the component but it has a number of issues;
1. Dependencies were wrong.
2. Angular 6 not correct supported.
3. Typescript / JavaScript mixed.
4. .css needed to be applied globally. 

So therefore I rebuild the treeview component making it fully TypeScript component. Embedding the .css into the component.

## TODO
1. Howto build a npm package of the component.

## features
+ open and close
+ select and deselect
+ disabled
+ loading
+ highlighted
+ checkbox
+ custom icon or no icon
+ drag and drop
+ no dots
+ large and small
+ default and dark theme
+ drag and drop between different tree

## Using

    `npm i tree-angular-component`

### in app.module.ts
```ts
import { TreeModule } from "library/treeview/treeview";

@NgModule({
    imports: [
        ..., 
        TreeModule,
        ... ],
    declarations: [
        ...
        ],
    bootstrap: [
        ...
        ],
})
export class AppModule { }
```

In application component MyComponent typescript
```ts
@Component({
    selector: 'app-root',
    templateUrl: './my.component.html'
})
class MyComponent 
{ 
    @ViewChild( 'TreeView' )    treeView: TreeComponent<Value>;    

    data = data as any;
    selectedId: number | null = null;
    public config: TreeConfig<Value>; 

    constructor() 
    { 
        this.config = new TreeConfig<Value>();
        this.config.checkbox = false;
        this.config.multiselect = false;
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
}
```

In application component MyComponent html
```html
<tree #TreeView
      [data]="data"
      [config]="config"
      (toggle)="onToggle( $event )"
      (change)="onChange( $event )">
</tree>
```

## properties and events of the component
name | type | description
--- | --- | ---
data | [TreeData](#tree-data-structure)[] | the data of the tree
config | [TreeConfig] | the TreeView configuration.
dropAllowed | (dropData: common.DropData) => boolean | optional, a function to show whether the drop action is allowed
zindex | number? | z-index of contextmenu
toggle | (eventData: [EventData](#event-data-structure)) => void | triggered when opening or closing a node
change | (eventData: [EventData](#event-data-structure)) => void | triggered when selecting or deselecting a node
drop | (dropData: [DropData](#drop-data-structure)) => void | triggered when drag a node, then drop it
dragTarget | [DragTargetData](#drag-target-data-structure) | drag target, used when drag and drop between different tree
changeDragTarget | (dragTarget: [DragTargetData](#drag-target-data-structure)) => void | triggered when drag target changed

## tree data structure

```ts
interface TreeData<T = any>  
{
    text?: string;
    value?: T; // anything attached to the node
    icon?: string | false; // the icon class string, or no icon if is false
    state: TreeNodeState;
    children?: TreeData<T>[];
    contextmenu?: string | Function; // the contextmenu component, props: (data: ContextMenuData<T>)
    component?: string | Function; // the node component, props: (data: TreeData<T>)
};
```

```ts
interface TreeNodeState  
{
    opened: boolean; // whether the node show its children
    selected: boolean;
    disabled: boolean; // disabled node can not be selected and deselected
    loading: boolean; // show the loading icon, usually used when loading child nodes
    highlighted: boolean;
    openable: boolean; // can open or close even no children
    dropPosition: DropPosition;
    dropAllowed: boolean; // whether the drop action is allowed
};
```

```ts
const enum DropPosition 
{
    empty,
    up,
    inside,
    down,
}
```

## event data interface

```ts
interface EventData<T = any> {
    data: TreeData<T>; // the data of the node that triggered the event
    path: number[]; // the index array of path from root to the node that triggered the event
};
```

## drop data interface

```ts
interface DropData<T = any> {
    sourceData: TreeData<T>;
    sourcePath: number[];
    sourceRoot: TreeData<T>[];
    targetData: TreeData<T>;
    targetPath: number[];
};
```

## contextmenu data interface

```ts
interface ContextMenuData<T = any> {
    data: TreeData<T>;
    path: number[];
    root: TreeData<T>[];
    parent?: any;
};
```

## drag target data interface

```ts
interface DragTargetData<T = any> {
    root: TreeData<T>[];
    target: HTMLElement;
} | null
```

## config class
```ts
class  TreeConfig 
{
    public theme:       string; # readonly
    public size:        string; # readonly
    public noDots:      boolean; # readonly
    public checkbox:    boolean;
    public preid:       string;
    public draggable:   boolean;
    public multiselect: boolean;

    constructor( theme: string, size: string, no_dots: boolean ) 
} | null
```

### Contructor parameters:
    theme   = 'default' | 'dark'
    size    = '' | 'large' | 'small'
    no_dots = true | false

### Members
get theme
get size
get noDots
get/set checkbox: boolean
get/set preid: string
get/set draggable: boolean
get/set multiselect: boolean
