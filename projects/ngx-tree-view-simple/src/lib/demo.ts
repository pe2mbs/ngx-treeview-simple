import { TreeData,
         DropPosition,
         Value,
         Data } from './treeview';

/*
cog
cogs
desktop
folder-open
folder
file-code
file-csv
file-import
file-pdf
file-powerpoint
file-word
file-upload
hand-point-right
thumbs-up
hdd
microchip
plus
question

*/


const rawData: Data[] = [
    {
        text: 'node 1',
        value: { id: 1 },
        icon: 'fa fa-folder-o',
        state: 
        {
            opened: true
        },
        children: [
            {
                text: 'node 11',
                value: { id: 11 },
                icon: 'fa fa-cog'
            },
            {
                text: 'node 12',
                value: { id: 12 },
                icon: 'fa fa-android',
                state: 
                {
                    opened: true
                },
                children: [
                    {
                        text: 'node 121',
                        value: { id: 121 },
                        icon: 'fa fa-thumbs-up',
                    },
                    {
                        text: 'node 122',
                        value: { id: 122 },
                        icon: 'fa fa-file-code-o',
                    },
                    {
                        text: 'node 123',
                        value: { id: 123 },
                        icon: 'fa fa-question',
                    }
                ]
            },
            {
                text: 'node 12',
                value: { id: 12 },
                icon: 'fa fa-cogs'
            },
            {
                text: 'node 13',
                value: { id: 13 },
                icon: 'fa fa-desktop'
            },
            {
                text: 'node 14',
                value: { id: 14 },
                icon: 'fas fa-laptop'
            },
            {
                text: 'node 15',
                value: { id: 15 },
                icon: 'fa fa-github'
            },
            {
                text: 'node 16',
                value: { id: 16 },
                icon: 'fa fa-tablet'
            },
            {
                text: 'node 17',
                value: { id: 17 },
                icon: 'fa fa-file-powerpoint-o'
            },
            {
                text: 'node 18',
                value: { id: 18 },
                icon: 'fa fa-file-word-o'
            },
            {
                text: 'node 19',
                value: { id: 19 },
                icon: 'fa fa-upload'
            },
            {
                text: 'node 20',
                value: { id: 20 },
                icon: 'fa fa-hdd-o'
            },
            {
                text: 'node 21',
                value: { id: 21 },
                icon: 'fa fa-microchip'
            },
            {
                text: 'node 22',
                value: { id: 22 },
                icon: 'fa fa-plus'
            },
            {
                text: 'node 23',
                value: { id: 23 },
                icon: 'fa fa-question'
            }
        ]
    },
    {
        text: 'loading node 2',
        value: { id: 2 },
        icon: 'fa fa-folder-o',
        state: 
        {
            openable: true
        }
    }
];

export const rawExtraData: Data[] = [
    {
        text: 'node 21',
        value: { id: 21 }
    },
    {
        text: 'disabled node 22',
        value: { id: 22 },
        state: 
        {
            disabled: true
        }
    },
    {
        text: 'no icon node 23',
        value: { id: 23 },
        icon: false
    },
    {
        text: 'custom icon node 24',
        value: { id: 24 },
        icon: 'tree-folder'
    },
    {
        text: 'file icon node 25 custom',
        value: { id: 25 },
        icon: 'tree-file'
    },
    {
        text: 'custom node 26',
        value: { id: 26 }
    },
    {
        text: 'highlighted node 27',
        value: { id: 27 },
        state: 
        {
            highlighted: true,
            openable: true
        }
    }
];

function standardize( treeData: Data ) 
{
    if ( treeData.state === undefined ) 
    {
        treeData.state = {};
    }
    if ( treeData.state.opened === undefined ) 
    {
        treeData.state.opened = false;
    }
    if ( treeData.state.selected === undefined ) 
    {
        treeData.state.selected = false;
    }
    if ( treeData.state.disabled === undefined )  
    {
        treeData.state.disabled = false;
    }
    if ( treeData.state.loading === undefined ) 
    {
        treeData.state.loading = false;
    }
    if ( treeData.state.highlighted === undefined ) 
    {
        treeData.state.highlighted = false;
    }
    if ( treeData.state.openable === undefined ) 
    {
        treeData.state.openable = false;
    }
    if ( treeData.state.dropPosition === undefined ) 
    {
        treeData.state.dropPosition = DropPosition.empty;
    }
    if ( treeData.state.dropAllowed === undefined ) 
    {
        treeData.state.dropAllowed = true;
    }
    if ( treeData.children === undefined ) 
    {
        treeData.children = [];
    }
    for ( const child of treeData.children ) 
    {
        standardize( child );
    }
    return;
}

for ( const child of rawData ) 
{
    standardize( child );
}

for ( const child of rawExtraData ) 
{
    standardize( child );
}

export const data       = rawData as TreeData<Value>[];
export const extraData  = rawExtraData as TreeData<Value>[];
