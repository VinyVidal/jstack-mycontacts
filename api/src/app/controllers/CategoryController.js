const repository = require('../repositories/CategoryRepository');

class CategoryController {
    async index(request, response) {
        const { order } = request.query;
        const categories = await repository.findAll(order);

        response.json(categories);
    }

    async show(request, response) {
        const { id } = request.params;
        const category = await repository.findById(id);

        if(!category) {
            return response.status(404).json({ error: 'Category not found' });
        }

        return response.json(category);
    }

    async store(request, response) {
        const { name } = request.body;

        if(!name) {
            return response.status(400).json({ error: 'Name is required'});
        }

        const category = await repository.create(
            {name}
        );

        return response.status(201).json(category);
    }

    async update(request, response) {
        const { id } = request.params;

        if(!isValidUUID(id)) {
            return response.status(400).json({ error: 'Invalid category id' });
        }

        const { name } = request.body;

        if(!name) {
            return response.status(400).json({ error: 'Name is required'});
        }

        const categoryExists = repository.findById(id);
        if(!categoryExists) {
            return response.status(404).json({ error: 'Category not found'});
        }

        const category = await repository.update(
            id, { name }
        );

        return response.json(category);
    }

    async delete(request, response) {
        const { id } = request.params;

        await repository.delete(id);

        return response.sendStatus(204);
    }
}

module.exports = new CategoryController();