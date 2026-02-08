import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
    const [name, setName] = useState('')
    const [status, setStatus] = useState(null)
    const [summary, setSummary] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = { name }

        try {
            await axios.post('http://localhost:8080/policy', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-correlation-id': Math.random().toString(36).substring(2, 15)
                }
            })
            setStatus('Policy created successfully')
            setName('')
        } catch (err) {
            setStatus('Error creating policy')
            console.error(err)
        }
    }

    const fetchSummary = async () => {
            try {
            const response = await axios.get('http://localhost:8080/policy/summary', {
                headers: {
                    'x-correlation-id': Math.random().toString(36).substring(2, 15)
                }
            })
            setSummary(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchSummary()
    }, [])

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1>Create Policy</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>
                        Policy Name:{' '}
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Create</button>
            </form>
            {status && <p>{status}</p>}
            <hr />
            <h2>Policy Status Summary</h2>
            {summary?.length === 0 ? "No policies available." : 
            summary.map((item, index) => (
                <p key={index}>{item.status}: {item.count}</p>
            ))}
        </div>
    )
}