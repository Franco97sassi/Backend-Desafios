import messagesManager from "../DAO/messagesDAO.js"

export default class CartServices{
    constructor(){
        this.dao=new messagesManager()
    } 
    async addMessage(message){
        let result=await this.dao.addMessage(message)
        return result
    }}
