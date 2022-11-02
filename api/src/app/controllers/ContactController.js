const isValidUUID = require('../../utils/isValidUUID');
const repository = require('../repositories/ContactRepository');

class ContactController {
    async index(request, response) {
        const { order } = request.query;
        const contacts = await repository.findAll(order);

        return response.json(contacts);
    }

    async show(request, response) {
        const { id } = request.params;
        const contact = await repository.findById(id);

        if(!contact) {
            return response.status(404).json({ error: 'Contact not found' });
        }

        return response.json(contact);
    }

    async store(request, response) {
        const { name, email, phone, category_id } = request.body;

        if(!name) {
            return response.status(400).json({ error: 'Name is required' });
        }

        if(category_id && !isValidUUID(category_id)) {
            return response.status(400).json({ error: 'Category is invalid' });
        }

        if(email) {
            const contactExists = await repository.findByEmail(email);
            if(contactExists) {
                return response.status(400).json({ error: 'This e-mail has already been taken' });
            }
        }

        const contact = await repository.create({
            name,
            email: email || null,
            phone,
            category_id: category_id || null,
        });

        return response.status(201).json(contact);
    }

    async update(request, response) {
        const { id } = request.params;

        if(!isValidUUID(id)) {
            return response.status(400).json({ error: 'Invalid contact id' });
        }

        const { name, email, phone, category_id } = request.body;

        if(!name) {
            return response.status(400).json({ error: 'Name is required' });
        }

        if(category_id && !isValidUUID(category_id)) {
            return response.status(400).json({ error: 'Category is invalid' });
        }

        const contactExists = await repository.findById(id);
        if(!contactExists) {
            return response.status(404).json({ error: 'Contact not found' });
        }

        if(email) {
            const contactByEmail = await repository.findByEmail(email);
            if(contactByEmail && contactByEmail.id !== id) {
                return response.status(400).json({ error: 'This e-mail has already been taken' });
            }
        }

        const contact = await repository.update(id, {
            name,
            email: email || null,
            phone,
            category_id: category_id || null,
        });

        return response.json(contact);
    }

    async delete(request, response) {
        const { id } = request.params;

        await repository.delete(id);

        return response.sendStatus(204);
    }
}

module.exports = new ContactController;