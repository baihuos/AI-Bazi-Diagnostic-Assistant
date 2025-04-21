import { NextResponse } from "next/server";
import pool from '@/lib/db';

export async function GET(request: Request) {
    try {
        // 查询所有文章
        const [rows] = await pool.query('SELECT * FROM articles');
        return NextResponse.json({
            code: 200,
            msg: "OK",
            data: rows
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({
            code: 500,
            msg: "Internal Server Error",
            data: null
        });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const [result] = await pool.query(
            'INSERT INTO articles (title, content) VALUES (?, ?)',
            [data.title, data.content]
        );
        return NextResponse.json({
            code: 200,
            msg: "OK",
            data: result
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
    } catch (error) {
        console.error('Error creating article:', error);
        return NextResponse.json({
            code: 500,
            msg: "Internal Server Error",
            data: null
        });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const [result] = await pool.query(
            'UPDATE articles SET title = ?, content = ? WHERE id = ?',
            [data.title, data.content, data.id]
        );
        return NextResponse.json({
            code: 200,
            msg: "OK",
            data: result
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
    } catch (error) {
        console.error('Error updating article:', error);
        return NextResponse.json({
            code: 500,
            msg: "Internal Server Error",
            data: null
        });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        const [result] = await pool.query(
            'DELETE FROM articles WHERE id = ?',
            [id]
        );
        return NextResponse.json({
            code: 200,
            msg: "OK",
            data: result
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
    } catch (error) {
        console.error('Error deleting article:', error);
        return NextResponse.json({
            code: 500,
            msg: "Internal Server Error",
            data: null
        });
    }
}

export async function OPTIONS(request: Request) {
    // 处理 OPTIONS 请求
    return NextResponse.json({
        code: 200,
        msg: "OK",
        data: null
    }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}