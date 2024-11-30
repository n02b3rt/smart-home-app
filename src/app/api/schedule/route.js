import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ścieżka do pliku JSON
const jsonFilePath = path.join(process.cwd(), 'data', 'schedule.json');

// Funkcja do odczytu pliku JSON
const readJSON = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Błąd podczas odczytu pliku JSON:', err);
                reject(err);
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (parseError) {
                    console.error('Błąd parsowania pliku JSON:', parseError);
                    reject(parseError);
                }
            }
        });
    });
};

// Funkcja do zapisu do pliku JSON
const writeJSON = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf-8', (err) => {
            if (err) {
                console.error('Błąd podczas zapisu do pliku JSON:', err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export async function GET() {
    try {
        const data = await readJSON();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Nie udało się odczytać danych.' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { day, startTime, endTime, subject, type } = body;

        if (!day || !startTime || !endTime || !subject || !type) {
            return NextResponse.json(
                { error: 'Brak wymaganych pól.' },
                { status: 400 }
            );
        }

        const existingData = await readJSON();
        const updatedData = [...existingData, { day, startTime, endTime, subject, type }];

        await writeJSON(updatedData);

        return NextResponse.json({ message: 'Zajęcia dodane pomyślnie.' }, { status: 201 });
    } catch (error) {
        console.error('Błąd podczas dodawania zajęć:', error);
        return NextResponse.json(
            { error: 'Nie udało się dodać zajęć.' },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const index = parseInt(searchParams.get('index'), 10);

        if (isNaN(index)) {
            return NextResponse.json(
                { error: 'Nieprawidłowy indeks.' },
                { status: 400 }
            );
        }

        const existingData = await readJSON();
        const updatedData = existingData.filter((_, i) => i !== index);

        await writeJSON(updatedData);

        return NextResponse.json({ message: 'Zajęcia usunięte pomyślnie.' }, { status: 200 });
    } catch (error) {
        console.error('Błąd podczas usuwania zajęć:', error);
        return NextResponse.json(
            { error: 'Nie udało się usunąć zajęć.' },
            { status: 500 }
        );
    }
}
