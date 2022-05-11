import React, { Component } from "react";
import {Link} from "react-router-dom";
let VotingInstance = require('./Voting')
let web3 = require('./Web3');
let project = {}
let projects = []
let ddl = ''
let style = ''
let state = ''
let indexes = []
class mine_voting extends  React.Component {
    constructor() {
        super()
        this.state = {
            accounts: ''
        }
    }
    Is_complete_style(id){
        project = projects[id]
        ddl = project.deadline
        let current_time = Date.parse(new Date())
        if(project.isSuccess === true){
            style = "badge badge-info ml-3"
        }
        else{
            if(ddl - current_time >= 0){
                style = "badge badge-warning ml-3"
            }
            else{
                style = "badge badge-secondary ml-3"
            }
        }
        return style
    }
    Is_complete(id){
        project = projects[id]
        ddl = project.deadline
        let current_time = Date.parse(new Date())
        if(project.isSuccess === true){
            state = "已完成募集"
        }
        else{
            if(ddl - current_time >= 0){
                state = "募集中"
            }
            else{
                state = "项目已过期"
            }
        }
        return state
    }
    componentWillMount = async () => {
        projects = [] //清空数组
        //获取当前的所有地址
        let accounts = await web3.eth.getAccounts()
        let projects_number = await VotingInstance.methods.allFundingsLength().call()
        for(let i = 0; i < projects_number; i++){
            let project =await VotingInstance.methods.allFundings(i).call()
            project.usedMoney = web3.utils.fromWei(project.usedMoney, 'ether')
            project.num_voted = web3.utils.fromWei(project.num_voted, 'ether')
            if(project.initiator === accounts[0]){
                indexes.push(i)
                projects.push(project)
            }
        }
        this.setState({
            // manager: manager,
            accounts: accounts
        })
    };
    render() {
        return (
            <div id="wrapper">

                <ul className="navbar-nav col-xl-1 bg-warning sidebar sidebar-dark accordion" id="accordionSidebar">

                        <a className="sidebar-brand d-flex align-items-center justify-content-center">
                            <div className="sidebar-brand-text mx-2">众筹系统</div>
                        </a>

                        {/*<!-- Divider -->*/}
                        {/*<hr className="sidebar-divider my-0">*/}

                        {/*// <!-- Nav Item - Dashboard -->*/}
                        <li className="nav-item  active">
                            <Link className="nav-link" to='/home'>
                                <span>首页</span></Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to='/all_votings'>
                                <span>所有众筹</span></Link>
                        </li>
                        {/*<!-- Divider -->*/}
                        {/*<hr className="sidebar-divider">*/}

                        <li className="nav-item">
                            <Link className="nav-link" to='/voting_creator'>
                                <span>发起众筹</span></Link>
                        </li>

                        {/*<!-- Divider -->*/}
                        {/*<hr className="sidebar-divider">*/}

                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
                               aria-expanded="true" aria-controls="collapseTwo">
                                <span>我的众筹</span>
                            </a>
                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo"
                                 data-parent="#accordionSidebar">
                                <div className="bg-white py-2 collapse-inner rounded">
                                    <h6 className="collapse-header">我的众筹:</h6>
                                    <Link className="collapse-item" to="/mine_voting">我发起的众筹</Link>
                                    <Link className="collapse-item" to="/attend_voting">我参与的众筹</Link>
                                </div>
                            </div>
                        </li>

                    </ul>
					
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <nav className="navbar navbar-expand navbar-light bg-danger topbar mb-4 static-top shadow">


                                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                                    <i className="fa fa-bars"/>
                                </button>

                                <ul className="navbar-nav">

                                    <li className="nav-item dropdown no-arrow d-sm-none">
                                        <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="fas fa-search fa-fw"/>
                                        </a>

                                        <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                             aria-labelledby="searchDropdown">
                                            <form className="form-inline mr-auto w-100 navbar-search">
                                                <div className="input-group">
                                                    <input type="text" className="form-control bg-light border-0 small"
                                                           placeholder="Search for..." aria-label="Search"
                                                           aria-describedby="basic-addon2"/>
                                                    <div className="input-group-append">
                                                        <button className="btn btn-primary" type="button">
                                                            <i className="fas fa-search fa-sm"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </li>


                                    <li className="nav-item dropdown no-arrow">
                                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <span className="mr-2 d-none d-lg-inline text-light small">
                                                当前账户地址：{this.state.accounts[0]}</span>
                                        </a>
                                    </li>

                                </ul>

                            </nav>

                        <div className="container-fluid">
                            <div className="row">

                                <div className="col-lg-12">
                                    {
                                        (projects.length === 0)
                                            ? null
                                            : projects.map((item, index) => {
                                                return (
                                                        <div className="card-body">
                                                            众筹项目名称： {item.title}
                                                            <span
                                                                className={this.Is_complete_style(index)}>{this.Is_complete(index)}</span>
                                                            <Link className="btn btn-warning" style={{float: "right"}}
                                                                  to={{pathname: '/mine_voting_info/' + indexes[index]}}>查看详情</Link>
                                                        </div>
                                                )
                                            }, this)
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default mine_voting;