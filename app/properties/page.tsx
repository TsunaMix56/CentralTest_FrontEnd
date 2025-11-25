"use client";

import { useEffect, useState } from "react";

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  description: string;
}

interface Favorite {
  id?: number;
  userId: number;
  propertyId: number;
  createdAt?: string;
  property?: {
    id: number;
    title: string;
    price: number;
    location: string;
    imageUrl: string;
  };
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [allFavorites, setAllFavorites] = useState<Favorite[]>([]);
  const [userFavorites, setUserFavorites] = useState<Favorite[]>([]);
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [likedByUsers, setLikedByUsers] = useState<{ [key: number]: string[] }>({});

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedUserId = localStorage.getItem("userId");
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
    if (savedUserId) {
      setUserId(savedUserId);
    }

    fetch("http://localhost:5292/api/properties")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    fetch("http://localhost:5292/api/Favorites")
      .then((res) => res.json())
      .then((data) => {
        setAllFavorites(data);
      })
      .catch((error) => {
        console.error(error);
      });

    if (savedUserId) {
      fetch(`http://localhost:5292/api/Favorites/user/${savedUserId}/properties`)
        .then((res) => res.json())
        .then((data) => {
          setUserFavorites(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    window.location.href = "/login";
  }

  function getLikeCount(propertyId: number) {
    return allFavorites.filter((fav) => fav.propertyId === propertyId).length;
  }

  function getUsersWhoLiked(propertyId: number) {
    const userIds = allFavorites
      .filter((fav) => fav.propertyId === propertyId)
      .map((fav) => fav.userId);
    
    return userIds;
  }

  async function loadLikedByUsers(propertyId: number) {
    const userIds = getUsersWhoLiked(propertyId);
    const usernames: string[] = [];

    for (const uid of userIds) {
      try {
        const res = await fetch(`http://localhost:5292/api/users/${uid}`);
        const user = await res.json();
        usernames.push(user.username);
      } catch (error) {
        console.error(error);
      }
    }

    setLikedByUsers((prev) => ({ ...prev, [propertyId]: usernames }));
  }

  function handleMouseEnter(propertyId: number) {
    setHoveredProperty(propertyId);
    loadLikedByUsers(propertyId);
  }

  function handleMouseLeave() {
    setHoveredProperty(null);
  }

  function isLiked(propertyId: number) {
    if (!userId) return false;
    
    return allFavorites.some((fav) => {
        // alert(fav.userId === parseInt(userId) && fav.propertyId === propertyId);
      return fav.userId === parseInt(userId) && fav.propertyId === propertyId;
    });
  }

  function handleLike(propertyId: number) {
    if (!userId) return;

    fetch("http://localhost:5292/api/Favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: parseInt(userId),
        propertyId: propertyId,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetch("http://localhost:5292/api/Favorites")
          .then((res) => res.json())
          .then((data) => {
            setAllFavorites(data);
            loadLikedByUsers(propertyId);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md p-4 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            รายการอสังหาริมทรัพย์
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-gray-700">
              ผู้ใช้: <span className="font-semibold">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={property.imageUrl}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {property.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  📍 {property.location}
                </p>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  ฿{property.price.toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  {property.description}
                </p>
                <div className="flex items-center gap-2 border-t pt-3">
                  <button
                    onClick={() => handleLike(property.id)}
                    className="flex items-center gap-1 transition-all"
                  >
                    {isLiked(property.id) ? (
                      <span style={{ fontSize: '36px', color: '#ff0000' }}>
                        ♥
                      </span>
                    ) : (
                      <span style={{ fontSize: '24px', color: '#d1d5db' }}>
                        ♡
                      </span>
                    )}
                  </button>
                  <div className="relative">
                    <span
                      className="text-gray-600 text-sm cursor-pointer"
                      onMouseEnter={() => handleMouseEnter(property.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {getLikeCount(property.id)} คน
                    </span>
                    {hoveredProperty === property.id && likedByUsers[property.id] && (
                      <div className="absolute bottom-full left-0 mb-2 bg-gray-800 text-white text-xs rounded py-2 px-3 whitespace-nowrap z-10">
                        {likedByUsers[property.id].length > 0 ? (
                          likedByUsers[property.id].map((username, idx) => (
                            <div key={idx}>{username}</div>
                          ))
                        ) : (
                          <div>ยังไม่มีคนกดไลค์</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
