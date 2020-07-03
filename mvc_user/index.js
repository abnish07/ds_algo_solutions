class Model{
    constructor(){
        this.state= this.loadData()||{
            userData:[
                // {
                //     id: Date.now(),
                //     username: '',
                //     email:'',
                //     status: false,
                   
                // },
                
            ]
        }
    }
    bindListChange(callback){
        this.updateCallback = callback;
    }

    saveData(state){
        localStorage.setItem('state', JSON.stringify(state))
    }

    loadData(){
        return JSON.parse(localStorage.getItem('state')) || null
    }

    setState(newState){
        this.state={
            ...newState
        }
        this.updateCallback(this.state.userData)
        this.saveData(this.state)
    }
}

class View{
    constructor(){
        this.app = document.getElementById('root')

        this.header = this.createEl('h1')
        this.header.textContent = 'MVC USER DETAILS'

        // username
        this.username = this.createEl('input');
        this.username.id = 'input-list';
        this.username.placeholder="add username";
        this.username.type = 'text';
        this.username.setAttribute('style', "padding: 5px; border-radius: 5px");

        // email list
        this.emailid = this.createEl('input');
        this.emailid.id = 'input-list2';
        this.emailid.placeholder="add email id";
        this.emailid.type = 'email';
        this.emailid.setAttribute('style', "padding: 5px; margin-left: 10px; border-radius: 5px");

        // List of user details
        this.list = this.createEl('table', 'list')
        this.list.setAttribute('style', "margin: 20px auto; padding: 10px")

        // Submit Button
        this.submitBtn = this.createEl('button');
        this.submitBtn.textContent = 'Submit';
        this.submitBtn.setAttribute('style', 'margin-left: 10px; padding: 5px; border-radius: 5px;')

        //append
        this.app.append(this.header, this.username, this.emailid, this.submitBtn, this.list)


    }

    createEl(tag, classIdenfier){
        const elem = document.createElement(tag)
        if(classIdenfier){
            elem.classList.add(classIdenfier)
        }
        return elem
    }

    // Rendering the Data
    renderDOM(data){
        this.list.innerHTML =''
        if(data.length=== 0){
            let p = this.createEl('p');
            p.textContent ='Data is empty';
            p.setAttribute('style', 'text-align: center;')
            this.list.append( p );
            return
        }
        const fragment = document.createDocumentFragment();

        data.forEach(item=>{
            const li = this.createEl('tr')
            li.id = item.id
            li.setAttribute('style', 'padding: 10px')
            const userName = this.createEl('td')
            userName.setAttribute('style', 'margin: 50px')
            const role = this.createEl('td')
            role.textContent = ''
            if(item.status){
                userName.textContent = item.username;  
                userName.setAttribute('style', 'color: red;')
                role.textContent = 'Admin'
            }
            else{                
                userName.textContent = item.username;
                userName.setAttribute('style', 'color: green;')
                role.textContent = 'User'
            }

            const emailId = this.createEl('td')
            emailId.textContent = item.email

            const checkbox = this.createEl('input')
            checkbox.type = 'checkbox'
            if(item.status){
                checkbox.checked = item.status
            }
          
            

            // if(item.status === 'Admin'){
            //     item.setAttribute('style', 'text-decoration: line-through')
            // }

            const del = this.createEl('button')
            del.setAttribute('style', 'color: red;')
            del.textContent = 'Delete';
            del.className= 'delete';

            li.append(userName, emailId, checkbox, role, del)
            fragment.append(li)
        })
        this.list.append(fragment)
    }

    bindAdd(handler){
        this.submitBtn.addEventListener('click', ()=>{
            handler(this.username.value, 
                this.emailid.value
                )
        })
    }
    bindDelete(handler){
        this.list.addEventListener('click', ()=>{
            if(event.target.className === 'delete'){
                let id = event.target.parentElement.id
                handler(id)
            }
        })
    }
    bindToggle(handler){
        this.list.addEventListener('click', ()=>{
            if(event.target.type === 'checkbox'){
                let id = event.target.parentElement.id
                handler(id)
            }
        })
    }
    // bindAdd(handler){
    //     this.submitBtn.addEventListener('click', ()=>{
    //         handler(this.username.value, this.email.value)
    //     })
    // }

}

class Controller{
    constructor(model, view){
        this.model = model,
        this.view = view 

        this.onChange(this.model.state.userData)
        
        //binding
        this.view.bindAdd( this.handleAdd )
        this.view.bindToggle( this.handleToggle )
        this.view.bindDelete( this.handleDelete )
        this.model.bindListChange( this.onChange )
    }

    onChange = data =>{
        this.view.renderDOM( data )
    }

    handleAdd=(username1, email1)=>{
        let state = this.model.state.userData;
        let payload = {
            username: username1,
            email: email1,
            id: Date.now(),
            status: false
        }
        console.log(state)

        this.model.setState({...this.model.state, userData: [ ...state, payload]})
    }

    handleToggle=(id)=>{
        console.log(id)
        let state = this.model.state.userData;
        state = state.map(item=>item.id === Number(id)?{...item, status: !item.status}:{...item})

        this.model.setState({...this.model.state, userData: state})
    }

    handleDelete=(id)=>{
        console.log(id)
        let state = this.model.state.userData;
        state = state.filter(item=>item.id !== Number(id))

        this.model.setState({...this.model.state, userData: state})
    }
}

const app = new Controller(new Model(), new View())