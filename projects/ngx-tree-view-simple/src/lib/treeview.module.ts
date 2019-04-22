import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree.component';
import { NodeComponent } from './treenode.component';
export * from './treeview';

/**
 * public
 */
@NgModule({
    declarations: [
        TreeComponent,
        NodeComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TreeComponent,
        NodeComponent
    ]
} )
export class TreeModule 
{ 

}
