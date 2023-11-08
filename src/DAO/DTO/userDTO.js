export default class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.full_name = `${user.last_name}, ${user.first_name}`;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
    this.cart = user.cart;
    this.documents = user.documents;
  }
}