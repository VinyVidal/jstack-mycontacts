const db = require('../../database'); // /index

class ContactRepository {
    async findAll(order = 'ASC') {
        const direction = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        const rows = await db.query(`
            SELECT contacts.*, categories.name as category_name
            FROM contacts
            LEFT JOIN categories ON categories.id = contacts.category_id
            ORDER BY contacts.name ${direction}
        `);

        return rows;
    }

    async findById(id) {
    const [row] = await db.query(`
        SELECT contacts.*, categories.name as category_name
        FROM contacts
        LEFT JOIN categories ON categories.id = contacts.category_id
        WHERE contacts.id = ? LIMIT 1
    `, [id]);

        return row;
    }

    async findByEmail(email) {
        const [row] = await db.query('SELECT * FROM contacts where email = ? LIMIT 1', [email]);

        return row;
    }

    async findLast() {
        const [row] = await db.query('SELECT * FROM contacts ORDER BY `order` DESC LIMIT 1');

        return row;
    }

    async create({ name, email, phone, category_id }) {
        const result = await db.query(`
            INSERT INTO contacts(name, email, phone, category_id)
            VALUES(?, ?, ?, ?)
        `, [name, email, phone, category_id]);

        if(!result.affectedRows) {
            return null;
        }

        const row = await this.findLast();

        return row;
    }

    async update(id, { name, email, phone, category_id }) {
        const result = await db.query(`
            UPDATE contacts
            SET name = ?, email = ?, phone = ?, category_id = ?
            WHERE id = ?
        `, [name, email, phone, category_id, id]);

        if(!result.affectedRows) {
            return null;
        }

        const row = await this.findById(id);

        return row;
    }

    async delete(id) {
        const result = await db.query('DELETE FROM contacts WHERE id = ?', [id]);

        return result;
    }
}

module.exports = new ContactRepository;