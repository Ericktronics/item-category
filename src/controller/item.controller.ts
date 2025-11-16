import {Response, Request} from "express";
import { query } from "../db-con/db";

export const getItems = async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM item');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getItemById = async (req: Request, res: Response) => {
    const itemId = req.params.id;
    try {
        const result = await query('SELECT * FROM item WHERE id = $1', [itemId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching item by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
}

export const createItem = async (req: Request, res: Response) => {
    const { name, description, price } = req.body;
    try {
        const result = await query(
            'INSERT INTO item (name, description, price) VALUES ($1, $2, $3) RETURNING *',
            [name, description, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateItem = async (req: Request, res: Response) => {
    const itemId = req.params.id;
    const { name, description, price } = req.body;
    try {
        const result = await query(
            'UPDATE item SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
            [name, description, price, itemId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteItem = async (req: Request, res: Response) => {
    const itemId = req.params.id;
    try {
        const result = await query(         
            'DELETE FROM item WHERE id = $1 RETURNING *',
            [itemId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

