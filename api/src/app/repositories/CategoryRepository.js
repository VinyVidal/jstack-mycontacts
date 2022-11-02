const db = require('../../database');

class CategoryRepository {
    async findAll(order = 'ASC') {
        const direction = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const rows = await db.query(`SELECT * FROM categories ORDER BY name ${direction}`);

        return rows;
    }

    async findById(id) {
        const [row] = await db.query('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);

        return row;
    }

    async findByLast() {
        const [row] = await db.query('SELECT * FROM categories ORDER BY `order` DESC LIMIT 1');

        return row;
    }

    async create({ name }) {
        const result = await db.query(`
            INSERT INTO categories(name)
            VALUES (?)
        `, [name]);

        if(!result.affectedRows) {
            return null;
        }

        const row = await this.findByLast();

        return row;
    }

    async update(id, { name }) {
        const result = await db.query(`
            UPDATE categories
            SET name = ?
            WHERE id = ?
        `, [name, id]);

        if(!result.affectedRows) {
            return null;
        }

        const row = await this.findById(id);

        return row;
    }

    async delete(id) {
        const result = await db.query('DELETE FROM categories WHERE id = ?', [id]);

        return result;
    }
}

module.exports = new CategoryRepository;