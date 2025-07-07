import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export const ProtectedDataComponent = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        if (!isLoaded || !isSignedIn) {
          console.log('Not loaded or not signed in');
          return;
        }

        const token = await getToken();
        console.log('Got token:', token ? 'Yes' : 'No');

        if (!token) {
          throw new Error('No token available');
        }

        const response = await fetch(`${API_URL}/api/protected`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error response:', errorData);
          throw new Error(`Failed to fetch protected data: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error in fetchProtectedData:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchProtectedData();
  }, [getToken, isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading authentication...</Text>
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Please sign in to view protected data</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.container}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Protected Data</Text>
      <Text>Message: {data.message}</Text>
      <Text>User ID: {data.userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  error: {
    color: 'red',
  },
}); 