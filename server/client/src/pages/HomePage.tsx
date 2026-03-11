import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../HomePage.css';
import { useCart}   from '../cartContext';

interface Game {
    id: number;
    title: string;
    price: number;
    genre: string;
    rating: number;
    image: string;
}

const HomePage: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [sortOption, setSortOption] = useState('default');
    const {cart} = useCart();
    const {addToCart} = useCart();

    useEffect(() => {
        fetch('http://localhost:3000/api/games')
            .then(res => {
                if (!res.ok) throw new Error('Ошибка загрузки данных');
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setGames(data);
                } else if (data && Array.isArray(data.games)) {
                    setGames(data.games);
                } else {
                    console.error("Сервер прислал не массив:", data);
                }
            })
            .catch(err => console.error("Ошибка при получении игр:", err));
    }, []);

    
    const genres = useMemo(() => {
        // Защита: если games еще не загружены или не массив
        if (!Array.isArray(games)) return ['All'];
        return ['All', ...Array.from(new Set(games.map((game) => game.genre)))];
    }, [games]);

    const filteredAndSortedGames = useMemo(() => {
        // Защита: если данных нет, возвращаем пустой массив, чтобы .map не упал
        if (!Array.isArray(games)) return [];

        let result = [...games];

        if (searchQuery) {
            result = result.filter(game =>
                game.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedGenre !== 'All') {
            result = result.filter(game => game.genre === selectedGenre);
        }

        switch (sortOption) {
            case 'price-asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        return result;
    }, [games, searchQuery, selectedGenre, sortOption]);

    const handleAddToCart = (game: Game) => {
        addToCart({
            id: game.id,
            title: game.title,
            price: game.price,
            image: game.image
        });
        alert(`"${game.title}" добавлена в корзину!`);
    };

    return (
        <div className="xenon-container">
            <header className="xenon-header">
                <div className="logo">
                    <h2>XenonZap</h2>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Поиск игр..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <nav className="header-nav">
                    <Link to="/login" className="nav-link">🖥️ Личный кабинет</Link>
                    <Link to="/cart" className="cart-btn">🛒 Корзина {cart.totalItems > 0 && `(${cart.totalItems})`}</Link>
                </nav>
            </header>

            <main className="xenon-main">
                <div className="controls-panel">
                    <div className="filter-group">
                        <label>Жанр: </label>
                        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                            {genres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sort-group">
                        <label>Сортировка: </label>
                        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="default">По умолчанию</option>
                            <option value="price-asc">Сначала дешевые</option>
                            <option value="price-desc">Сначала дорогие</option>
                            <option value="rating">По рейтингу</option>
                        </select>
                    </div>
                </div>

                <div className="games-grid">
                    {filteredAndSortedGames.length > 0 ? (
                        filteredAndSortedGames.map(game => (
                            <div key={game.id} className="game-card">
                                <img src={game.image} alt={game.title} className="game-image" />
                                <div className="game-info">
                                    <h3>{game.title}</h3>
                                    <p className="game-genre">{game.genre}</p>
                                    <div className="game-meta">
                                        <span className="game-rating">★ {game.rating}</span>
                                        <span className="game-price">
                                            {game.price === 0 ? 'Бесплатно' : `$${game.price}`}
                                        </span>
                                    </div>
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(game)}
                                    >
                                        В корзину
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            {games.length === 0 ? "Загрузка игр..." : "Игры не найдены"}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HomePage;