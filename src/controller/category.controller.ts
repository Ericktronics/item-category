import {Response, Request} from "express";
import { query } from "../db-con/db";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM category');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    try {
        const result = await query('SELECT * FROM categories WHERE id = $1', [categoryId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const createCategory = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    try {
        const result = await query(
            'INSERT INTO category (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    const { name, description } = req.body;
    try {
        const result = await query(
            'UPDATE category SET name = $1, description = $2 WHERE id = $3 RETURNING *',
            [name, description, categoryId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    try {
        const result = await query(
            'DELETE FROM category WHERE id = $1 RETURNING *',
            [categoryId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}