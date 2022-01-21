import React, { Component } from "react"
import Main from "../templates/Main"
import axios from 'axios'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de Usuários: Incluir, Listar, Alterar e Excluir.'
}

const baseUrl = 'http://localhost:3001/users'
const initialState = {
    user: {name: '', email:''},
    list: []
}

export default class UserCrud extends Component {
    
    constructor(props){
        super(props)
        this.state = { ...initialState }
    }
    
    componentDidMount(){
        axios(baseUrl)
            .then(resp => {
                this.setState({list: resp.data})
            })
    }

    clear(){
        this.setState({user: initialState.user})
    }

    save(){
        const user = this.state.user
        const method = user.id ? 'put' :  'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({user: initialState.user, list})
            })
    }

    getUpdatedList(user, add = true){
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.push(user)
        return list
    }

    updateField(event){
        const user = { ...this.state.user }
        console.log(user[event.target.name])
        user[event.target.name] = event.target.value
        console.log(user[event.target.name])
        this.setState({ user })
    }

    renderForm(){
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label >Nome</label>
                            <input type="text" className="form-control" name="name" 
                            value={this.state.user.name}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite o nome..."
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label >E-mail</label>
                            <input type="text"  className="form-control" name="email"
                            value={this.state.user.email}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite o e-mail..."/>
                        </div>
                    </div>
                </div>

                <hr />
                <div className="col-12 d-flex justify-content-end">
                    <button className="btn btn-primary mx-2"
                    onClick={e => this.save(e)}>
                        Salvar
                    </button>
                    <button className="btn btn-secondary"
                    onClick={e => this.clear(e)}>
                        Cancelar
                    </button>
                </div>
            </div>
        )
    }

    load(user){
        this.setState({user})
    }

    remove(user){
        axios.delete(`${baseUrl}/${user.id}`)
            .then(resp => {
                const list = this.getUpdatedList(user, false)
                this.setState({ list })
            })
    }

    renderTable(){
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th className="text-center">ID</th>
                        <th className="text-center">Nome</th>
                        <th className="text-center">E-mail</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows(){
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td className="text-center">{user.id}</td>
                    <td className="text-center">{user.name}</td>
                    <td className="text-center">{user.email}</td>
                    <td className="text-center">
                        <button className="btn btn-warning"
                        onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>&nbsp;
                        <button className="btn btn-danger my-2"
                        onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}