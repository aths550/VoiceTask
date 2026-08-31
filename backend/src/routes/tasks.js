import express from 'express';
import { supabase } from '../db/supabaseClient.js';

const router = express.Router();

const mapToCamelCase = (task) => {
  if (!task) return task;
  const mapped = { ...task };
  if ('due_date' in mapped) {
    mapped.dueDate = mapped.due_date;
    delete mapped.due_date;
  }
  if ('created_at' in mapped) {
    mapped.createdAt = mapped.created_at;
    delete mapped.created_at;
  }
  return mapped;
};

// GET all tasks (hardcoded demo user scope assumed for MVP, so we just get all)
router.get('/', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data.map(mapToCamelCase));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST a new task
router.post('/', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
    
    // We expect either a single task or an array of tasks
    const tasks = Array.isArray(req.body) ? req.body : [req.body];
    
    // Validate all tasks have at least a title
    const invalidTasks = tasks.filter(t => !t.title || typeof t.title !== 'string' || t.title.trim() === '');
    if (invalidTasks.length > 0) {
      return res.status(400).json({ error: 'All tasks must have a valid title' });
    }
    
    const tasksToInsert = tasks.map(task => ({
      title: task.title || 'Untitled Task',
      description: task.description || '',
      owner: task.owner || 'You',
      due_date: task.dueDate || null,
      priority: task.priority || 'medium',
      source: task.source || 'text',
      status: 'pending',
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('tasks')
      .insert(tasksToInsert)
      .select();

    if (error) throw error;
    res.status(201).json(data.map(mapToCamelCase));
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH update a task (e.g., mark as done)
router.patch('/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
    
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Update payload cannot be empty' });
    }

    // Map incoming camelCase updates to snake_case for the database
    const mappedUpdates = { ...updates };
    if ('dueDate' in mappedUpdates) {
      mappedUpdates.due_date = mappedUpdates.dueDate;
      delete mappedUpdates.dueDate;
    }
    if ('createdAt' in mappedUpdates) {
      mappedUpdates.created_at = mappedUpdates.createdAt;
      delete mappedUpdates.createdAt;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(mappedUpdates)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (data.length === 0) return res.status(404).json({ error: 'Task not found' });
    
    res.json(mapToCamelCase(data[0]));
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
    
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
