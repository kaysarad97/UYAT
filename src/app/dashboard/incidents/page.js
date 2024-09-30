'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { ProductsFilters } from '@/components/dashboard/incidents/products-filters';
import { ProductsTable } from '@/components/dashboard/incidents/products-table';

// Import TokenService
import { authClient } from '@/lib/auth/custom/client';
import TokenService from '@/lib/auth/custom/refresh';

export default function Page({ searchParams }) {
  const [incidents, setIncidents] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filters, setFilters] = React.useState({
    status: searchParams.status || '',
    date_filter: searchParams.date_filter || '',
    tag: '', // Add tag filter to state if needed
  });

  // Fetch tags from the API
  const fetchTags = async () => {
    try {
      const response = await fetch('http://37.99.82.96:8000/api/v1/tags/');
      if (!response.ok) {
        throw new Error('Ошибка при загрузке тегов');
      }
      const tagsData = await response.json();
      setTags(tagsData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  React.useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const userResponse = await authClient.getUser();
        if (!userResponse || !userResponse.data) {
          throw new Error('User is not authenticated');
        }

        let token = TokenService.getAccessToken();

        // Construct the query parameters based on the filters
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('statuses', filters.status);
        if (filters.date_filter) queryParams.append('date_filter', filters.date_filter);
        if (filters.tag) queryParams.append('tags', filters.tag); // Handle tag filtering if needed

        // Fetch incidents with filters applied
        let response = await fetch(`http://37.99.82.96:8000/api/v1/incident-web/history/?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          await TokenService.refreshTokens();
          token = TokenService.getAccessToken();
          response = await fetch(`http://37.99.82.96:8000/api/v1/incident-web/history/?${queryParams.toString()}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        }

        if (!response.ok) {
          throw new Error('Failed to fetch incident data');
        }

        const data = await response.json();
        setIncidents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch tags and incidents
    fetchTags();
    fetchIncidents();
  }, [filters]); // Trigger fetching when filters change

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 'var(--Content-maxWidth)', m: 'var(--Content-margin)', p: 'var(--Content-padding)', width: 'var(--Content-width)' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'var(--Content-maxWidth)', m: 'var(--Content-margin)', p: 'var(--Content-padding)', width: 'var(--Content-width)' }}>
      <Stack spacing={4}>
        <Typography variant="h4">Список проишествий</Typography>
        <Card>
          <ProductsFilters filters={filters} onChange={handleFiltersChange} tags={tags} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            <ProductsTable rows={incidents} filters={filters} />
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}
