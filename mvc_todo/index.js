
class Model{
    constructor(){

        this.state= this.loadData()|| {
               todo: [
                    {
                        id:1,
                        title: "Buy Milk",
                        status: false
                    },
                    {
                        id:2,
                        title: "Buy Bread",
                        status: false
                    },
                    {
                        id:3,
                        title: "Buy Butter",
                        status: true
                    }
                ]
            }
    }

    bindListChange(callback){
        this.updateCallback = callback
    }

    saveData(state){
        localStorage.setItem('state', JSON.stringify(state))
    }

    loadData(){
        return JSON.parse(localStorage.getItem('state'))|| null
    }

    setState(newState){
        this.state={
            ...newState
        }
        console.log("updating" , this.state)
        this.updateCallback( this.state.todo )
        this.saveData(this.state)
    }
}

class View{
    constructor(){
        // APP PART
        this.app=document.getElementById('root')

        // HEADER PART
        this.header = this.createEl('h1')
        this.header.textContent="MVC TODO"

        // INPUT PART
        this.input = this.createEl('input');
        this.input.id = 'input-list';
        this.input.placeholder = 'add items';
        this.input.type = 'text'
        this.input.setAttribute('style', "padding: 5px; border-radius: 5px")
        // List of the items
        this.list = this.createEl("ul", "list")
        this.list.setAttribute('style', 'display: flex, flex-direction: column')

        // submit button
        this.submitBtn = this.createEl('button')
        this.submitBtn.textContent = 'ADD'
        this.submitBtn.setAttribute('style', "margin-left: 10px; padding: 5px; border-radius: 5px")
        //append
        this.app.append(this.header, this.input,this.submitBtn, this.list )

    }

    createEl(tag, classIdentifier){
        const elem = document.createElement(tag)
        if(classIdentifier){
            elem.classList.add(classIdentifier)
        }
        return elem
    }

    // Rendering the Data
    renderDOM(data){
        this.list.innerHTML = ''

        if(data.length ==0){
            let p = this.createEl('p')
            p.textContent = 'List is Empty';
            this.list.append( p )
            return 
        }
        const fragment = document.createDocumentFragment()
        data.forEach(item=>{
            const li = this.createEl('li')
            li.setAttribute('style', 'flex-basis: 1')
            li.id = item.id

            const p = this.createEl('p')
            p.setAttribute('style', 'flex-basis: 1')
            p.textContent = item.title
            p.contentEditable = true
            p.className = 'edit'

            const checkbox = this.createEl('input')
            checkbox.setAttribute('style', 'flex-basis: 1')
            checkbox.type = 'checkbox'
            checkbox.checked = item.status

            if(item.status){
                p.setAttribute('style', 'text-decoration: line-through')
            }

            const del = this.createEl('button')
            del.setAttribute('style', 'flex-basis: 1; color: red;')
            del.textContent="Delete"
            del.className = 'delete'

            li.append(p, checkbox, del)
            fragment.append( li )
        })
        this.list.append(fragment)
    }

        bindAdd(handler){
            this.submitBtn.addEventListener('click', ()=>{
                handler(this.input.value)
            })
        }
        bindDelete(handler){
            this.list.addEventListener('click', ()=>{
                if(event.target.className==='delete'){
                    let id=event.target.parentElement.id
                    handler( id )
                }
            })
        }
        bindToggle(handler){
            this.list.addEventListener('click', ()=>{
                if(event.target.type === 'checkbox'){
                    let id=event.target.parentElement.id
                    handler( id )
                }
            })
        }
        bindEdit(handler){
            this.list.addEventListener('focusout', ()=>{
                if(event.target.className==='edit'){
                    let id=event.target.parentElement.id
                    handler( id, event.target.textContent )
                }
            })
        }
}

class Controller{
    constructor(model, view){
        this.model = model,
        this.view = view

        this.onChange( this.model.state.todo )
        // binding
        this.view.bindAdd( this.handleAdd )
        this.view.bindDelete( this.handleDelete )
        this.view.bindToggle( this.handleToggle )
        this.view.bindEdit( this.handleEdit )
        this.model.bindListChange( this.onChange )
    }

    onChange =data=>{
        this.view.renderDOM( data )
    }

    handleAdd=(value)=>{
        let state = this.model.state.todo;
        let payload={
            title: value,
            id: Date.now(),
            status: false
        }
        this.model.setState({ ...this.model.state, todo: [ ...state, payload ] })
    }

    handleDelete=(id)=>{

        let state = this.model.state.todo;
        state = state.filter( item=>item.id !== Number(id))
        this.model.setState({ ...this.model.state, todo: state })
    }
    

    handleToggle=(id)=>{
        console.log(id)
        let state = this.model.state.todo;
        state = state.map( item=>item.id === Number(id)? {...item, status: !item.status}:{...item})

        this.model.setState({ ...this.model.state, todo: state })
    }
    
    handleEdit=(id, updatedvalue)=>{
        let state = this.model.state.todo;
        state = state.map( item=>item.id === Number(id)? {...item, title: updatedvalue}:{...item})

        this.model.setState({ ...this.model.state, todo: state })
    }
    

}

const app = new Controller(new Model(), new View())