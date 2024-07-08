import express from 'express';
import { Todo } from './models';

const router = express.Router();

router.post('/', async (req, res) => {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
});

router.get('/', async (req, res) => {
    const todos = await Todo.findAll();
    res.json(todos);
});

router.put('/:id', async (req, res) => {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
        await todo.update(req.body);
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

router.delete('/:id', async (req, res) => {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
        await todo.destroy();
        res.json({ message: 'Todo deleted' });
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

router.patch('/:id/complete', async (req, res) => {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
        todo.completed = !todo.completed;
        await todo.save();
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

export { router as todoRoutes };
