import React, { useEffect, useState, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5001/products'); // Adjust this to your API endpoint
            const data = await response.json();
            const normalizedProducts = data.map(product => ({
                ...product,
                price: parseFloat(product.price) || 0,
                quantity: parseInt(product.quantity) || 0
            }));
            setProducts(normalizedProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const calculateTotals = () => {
        const totalQty = products.reduce((acc, product) => acc + (product.quantity || 0), 0);
        const totalVal = products.reduce((acc, product) => acc + (product.price * (product.quantity || 0)), 0);
        return {
            totalProducts: products.length,
            totalQuantity: totalQty,
            totalValue: totalVal,
        };
    };

    // Prepare the data for the bar chart
    const productNames = products.map(product => product.name);
    const quantities = products.map(product => product.quantity);
    
    const data = {
        labels: productNames,
        datasets: [
            {
                label: 'Product Quantity',
                data: quantities,
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Light blue
                borderColor: 'rgba(54, 162, 235, 1)', // Dark blue
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Quantity' },
            },
            x: {
                title: { display: true, text: 'Product' },
            },
        },
    };

    const { totalProducts, totalQuantity, totalValue } = calculateTotals();

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Total Products: {totalProducts}</p>
            <p>Total Quantity: {totalQuantity}</p>
            <p>Total Value: R{totalValue.toFixed(2)}</p>

            <h3>Product List</h3>
            {products.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '2px solid #ddd', padding: '8px' }}>Product Name</th>
                            <th style={{ border: '2px solid #ddd', padding: '8px' }}>Description</th>
                            <th style={{ border: '2px solid #ddd', padding: '8px' }}>Category</th>
                            <th style={{ border: '2px solid #ddd', padding: '8px' }}>Price (R)</th>
                            <th style={{ border: '2px solid #ddd', padding: '8px' }}>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td style={{ border: '2px solid #ddd', padding: '8px' }}>{product.name}</td>
                                <td style={{ border: '2px solid #ddd', padding: '8px' }}>{product.description}</td>
                                <td style={{ border: '2px solid #ddd', padding: '8px' }}>{product.category}</td>
                                <td style={{ border: '2px solid #ddd', padding: '8px' }}>{product.price.toFixed(2)}</td>
                                <td style={{ border: '2px solid #ddd', padding: '8px' }}>{product.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No products available.</p>
            )}

            <h3>Product Quantity Bar Chart</h3>
            {products.length > 0 && (
                <div style={{ maxWidth: '600px', margin: '20px auto' }}>
                    <Bar data={data} options={options} />
                </div>
            )}

            {/* Animated Images Section */}
            <h3>Our Products</h3>
            <div className="image-container">
                <img src="/lolo.jpg" alt="Featured Product 2" className="move" />
                <img src="/opopopo.jpg" alt="Featured Product 1" className="rotate" />
                <img src="/sss.jpg" alt="Featured Product 2" className="move" />
                <img src="/llll.jpg" alt="Featured Product 1" className="rotate" />
                {/* Add more images as needed */}
            </div>

            <style jsx>{`
                .image-container {
                    display: flex;
                    justify-content: center;
                    overflow: hidden;
                }
                .rotate {
                    width: 150px;
                    height: 150px;
                    animation: rotate 5s linear infinite;
                    margin-right: 20px; /* Space between images */
                }

                .move {
                    width: 150px;
                    height: 150px;
                    animation: move 5s linear infinite;
                }

                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes move {
                    0% {
                        transform: translateX(0px);
                    }
                    50% {
                        transform: translateX(-100px); /* Move 100px to the left */
                    }
                    100% {
                        transform: translateX(0px);
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;