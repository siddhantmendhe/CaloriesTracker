//Storage Controller
const StorageCtrl=(function(){
    //public methods
    return{
        storeItem:function(item){
            let items;
            if(localStorage.getItem('items')===null){
                items=[];
                items.push(item);
                //Set ls
                localStorage.setItem('items',JSON.stringify(items));

            }
            else{
                //Get what is already in ls
                items=JSON.parse(localStorage.getItem('items'));
                //Push new item
                items.push(item);
                //Reset ls
                localStorage.setItem('items',JSON.stringify(items));
            }

        }
        ,
        getItemFromStorage:function(){
            let items;
            if(localStorage.getItem('items')===null){
                items=[];

            }else{
                items=JSON.parse(localStorage.getItem('items')); 

            }
            return items;
        },
        updateItemStorage:function(updatedItem){
            items=JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(item.id===updatedItem.id){
                    items.splice(index,1,updatedItem);
                }

            });
            localStorage.setItem('items',JSON.stringify(items));

        },
        deleteItemFromStorage:function(id){
            items=JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(item.id===id){
                    items.splice(index,1);
                }

            });
            localStorage.setItem('items',JSON.stringify(items));
        },
        clearItemsFromStorage:function(){
            items=JSON.parse(localStorage.getItem('items'));
            items=[];
            localStorage.setItem('items',JSON.stringify(items));


        }

    }
})();
//Item Controller
const ItemCtrl=(function(){
    //Item Constructor
    const Item=function(id,name,calories){
        this.id=id;
        this.name=name;
        this.calories=calories;
    }

    //Data Structure / State
    const data={
        // items:[
           
        // ],
        items: StorageCtrl.getItemFromStorage(),
        currentItem:null,
        totalCalories:0
    }
    //Public methods
    return{ 
        geItems:function(){
            return data.items;
        },
        logData: function(){
            return data;
        },
        getTotalCalories:function(){
            let total=0;
            //loop
            data.items.forEach(function(item){
                total+=item.calories;
            });
            data.totalCalories=total;
            return data.totalCalories;
            
        },
        geItemById:function(id){
            let found=null;
            //Loop through items
            data.items.forEach(function(item){
                if(item.id===id){
                    found=item;
                }
            });
            return found;

        },
        updateItem:function(name,calories){
            calories=parseInt(calories);
            let found=null;
            data.items.forEach(function(item){
                if(item.id===data.currentItem.id){
                    item.name=name;
                    item.calories=calories;
                    found=item;
                }
            });
            return found;

        },
        deleteItem: function(id){
            //Get ids
            const ids=data.items.map(function(item){
                return item.id;

            });

            //Get index
            const index =ids.indexOf(id);
            //Remove item
            console.log(index);
            data.items.splice(index,1);

        },
        clearAllItems:function(){
            data.items=[];

        },
        setCurrentItem:function(item){
            data.currentItem=item;
            console.log(`set item`);

        },
        getCurrentItem:function(){
            return data.currentItem;
        },
        addItem:function(name,calories){
            //Create import {  } from 
            if(data.items.length>0){
                ID=data.items[data.items.length-1].id+1;
            }else{
                ID=0;
            }
            calories=parseInt(calories);
            newItem=new Item(ID,name,calories);
            data.items.push(newItem);
            return newItem;
        }

    }

})();

//UI Controller
const UICtrl=(function(){
    const UISelectors={
        itemList:'#item-list',
        listItems:'#item-list li',
        addBtn:'.add-btn',
        itemNameInput:'#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories:'.total-calories',
        deleteBtn:'.delete-btn',
        updateBtn:'.update-btn',
        clearBtn:'.clear-btn',        
        backBtn:'.back-btn'

    }

    //Public methods
    return {
        populateItemList:function(items){
            let html='';
            items.forEach(function(item){
               html+= `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      document.querySelector(UISelectors.itemList).innerHTML= html;

            });
        },
        getItemInput:function(){
            return{
                name:document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        addListItem:function(item){
            document.querySelector(UISelectors.itemList).style.display='block'; 
            const li=document.createElement('li');
            li.className='collection-item';
            li.id=`item-${item.id}`;
            li.innerHTML=`
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
          document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li); 

        },
        updateListItem:function(item){
            let listItem=document.getElementById(`item-${item.id}`);
            listItem.innerHTML=` <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`

        },
        deleteListItem:function(id){
            document.querySelector(`#item-${id}`).remove();

        },
        clearInput:function(){
            document.querySelector(UISelectors.itemNameInput).value='';
            document.querySelector(UISelectors.itemCaloriesInput).value='';

        },
        hideList:function(){
            document.querySelector(UISelectors.itemList).style.display='none';

        },
        shwoTotalCalories:function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent=totalCalories;
        },
        clearEditState:function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display='none';
            document.querySelector(UISelectors.deleteBtn).style.display='none';
            document.querySelector(UISelectors.backBtn).style.display='none';
            document.querySelector(UISelectors.addBtn).style.display='inline';


        },
        showEditState:function(){
            document.querySelector(UISelectors.updateBtn).style.display='inline';
            document.querySelector(UISelectors.deleteBtn).style.display='inline';
            document.querySelector(UISelectors.backBtn).style.display='inline';
            document.querySelector(UISelectors.addBtn).style.display='none';        

        },
        removeItems:function(){
            let listItems=document.querySelectorAll(UISelectors.listItems);
            //Turn nodelist into array
            listItems=Array.from(listItems);
            //Remove item form array
            console.log(listItems);
            listItems.forEach(function(item){
                item.remove();
            });

        },
        addItemToForm:function(){
            document.querySelector(UISelectors.itemNameInput).value=
            ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value=
            ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        getSelectors:function(){
            return UISelectors;
        }
    }

})();

//App Controller
const App=(function(ItemCtrl,StorageCtrl,UICtrl){

    const loadEventListners=function(){
        const UISelectors=UICtrl.getSelectors();
        //Disable submit on enter
        document.addEventListener('keypress',function(e){
            if(e.keyCode===13 || e.which===13){
                e.preventDefault();
                return false;
            }
        })
        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
        //Update item
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
        //Delete button
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
        //Back button
        document.querySelector(UISelectors.backBtn).addEventListener('click',backButton);
        //Clear button
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);

        


    }
    const itemAddSubmit=function(e){
        e.preventDefault();

        console.log('Add');
        const input=UICtrl.getItemInput();
        if(input.name!==''&& input.calories!==''){
            console.log('in if condition');
        const newItem=ItemCtrl.addItem(input.name,input.calories);
        //Add item to ui list
        UICtrl.addListItem(newItem);
        //get total calories
        const totalCalories=ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.shwoTotalCalories(totalCalories);
        //Store in localStorage
        StorageCtrl.storeItem(newItem);
        UICtrl.clearInput();

        }

    }
    //click edit item 
    const itemEditClick=function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list item id(item-0, item-1)
            const listId=e.target.parentNode.parentNode.id;
            //Break into an array
            const listIdArr=listId.split('-');
            //Get the an array
            const id=parseInt(listIdArr[1]);
            //Get item
            const itemToEdit=ItemCtrl.geItemById(id);
            console.log(itemToEdit);
            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            //add item to form
            UICtrl.addItemToForm();
            

        }

        e.preventDefault();


    }
    //item Update Submit
    const itemUpdateSubmit=function(e) {
       
        console.log('update');
        e.preventDefault();

        const input=UICtrl.getItemInput();
        if(input.name!==''&& input.calories!==''){
        const updatedItem=ItemCtrl.updateItem(input.name,input.calories);
    
        UICtrl.updateListItem(updatedItem);
        //get total calories
        const totalCalories=ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.shwoTotalCalories(totalCalories);   
        StorageCtrl.updateItemStorage(updatedItem);
        UICtrl.clearEditState();    

        }
        
       
        
    }
    //back button
    const backButton=function(e){
        e.preventDefault();
        UICtrl.clearEditState();
    }
    //Item delete submit
    const itemDeleteSubmit=function(e){
        //Get current item
        const currentItem=ItemCtrl.getCurrentItem();
        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id); 
        console.log('delete item');
        UICtrl.deleteListItem(currentItem.id);
        //get total calories
        const totalCalories=ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.shwoTotalCalories(totalCalories);
        //Delete from ls
        StorageCtrl.deleteItemFromStorage(currentItem.id);    
        UICtrl.clearEditState();  
        e.preventDefault();

    }

    //Clear all items
    const clearAllItemsClick=function(e){
        //Delete all items from data structure
        ItemCtrl.clearAllItems();
        //Remove form UI
        UICtrl.removeItems();
        //get total calories
        const totalCalories=ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.shwoTotalCalories(totalCalories);    
        //Clear All from ls
        StorageCtrl.clearItemsFromStorage();
        //Hide UL
        UICtrl.hideList();
        e.preventDefault();

    }


    return{
        init: function () {
            console.log('Initializing App...');
            //clear edit state / set initial set
            UICtrl.clearEditState();
            //Fetch Items from data structure
            const items=ItemCtrl.geItems();
            if(items.length===0){
                UICtrl.hideList();
            }
            else{
                UICtrl.populateItemList(items);
                const totalCalories=ItemCtrl.getTotalCalories();
                //add total calories to UI
                UICtrl.shwoTotalCalories(totalCalories);

            }
          
            //Load event listners
            loadEventListners();
        }
    }

})(ItemCtrl,StorageCtrl,UICtrl);

App.init();