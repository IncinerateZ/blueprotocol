export default class Reward {
    constructor(type_string, db_path = '../data/DB.json') {
        this.type_string = type_string;
        this.DB = require('../data/DB.json');
    }

    create(id, type, amount, loc) {
        this.id = id;
        this.type = type;
        this.loc = loc;

        this.name = '';
        this.amount = amount;

        this.exec();
    }

    build() {
        return (
            <p key={this.id}>
                {this.name} x{this.amount}
            </p>
        );
    }

    exec() {}
}
