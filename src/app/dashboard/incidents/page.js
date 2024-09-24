'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { paths } from '@/paths';
import { ProductModal } from '@/components/dashboard/incidents/product-modal';
import { ProductsFilters } from '@/components/dashboard/incidents/products-filters';
import { ProductsPagination } from '@/components/dashboard/incidents/products-pagination';
import { ProductsTable } from '@/components/dashboard/incidents/products-table';

import { authClient } from '@/lib/auth/custom/client';
import TokenService from '@/lib/auth/custom/refresh';



export default function Page({ searchParams }) {
  const { category, previewId, sortDir, sku, status } = searchParams;

  const [incidents, setIncidents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // Check if user is authenticated
        const userResponse = await authClient.getUser();
        if (!userResponse || !userResponse.data) {
          throw new Error('User is not authenticated');
        }

        // Get the current access token
        let token = TokenService.getAccessToken();

        // Fetch incidents data
        let response = await fetch('http://37.99.82.96:8000/api/v1/incident-web/history/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // If the token is expired, attempt to refresh it
        if (response.status === 401) {
          try {
            // Attempt to refresh the token
            await TokenService.refreshTokens();
            token = TokenService.getAccessToken(); // Get the new access token

            // Retry fetching the incidents with the new token
            response = await fetch('http://37.99.82.96:8000/api/v1/incident-web/history/', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to fetch incident data after refreshing token');
            }
          } catch (refreshError) {
            // Handle token refresh failure
            TokenService.clearTokens(); // Clear tokens if refresh fails
            setError('Session expired, please log in again.');
            return;
          }
        }

        // Parse the response data
        const data = await response.json();
        setIncidents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const orderedIncidents = applySort(incidents, sortDir);
  const filteredIncidents = applyFilters(orderedIncidents, { category, sku, status });

  return (
    <React.Fragment>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <Typography variant="h4">История проишествий</Typography>
            </Box>
            <div>
              {/* Additional elements, e.g., buttons */}
            </div>
          </Stack>
          <Card>
            <ProductsFilters filters={{ category, sku, status }} sortDir={sortDir} />
            <Divider />
            <Box sx={{ overflowX: 'auto' }}>
              <ProductsTable rows={filteredIncidents} />
            </Box>
            <Divider />
            <ProductsPagination count={filteredIncidents.length} page={0} />
          </Card>
        </Stack>
      </Box>
      <ProductModal open={Boolean(previewId)} />
    </React.Fragment>
  );
}

function applySort(rows, sortDir) {
  return rows.sort((a, b) => {
    if (sortDir === 'asc') {
      return new Date(a.geo.timestamp).getTime() - new Date(b.geo.timestamp).getTime();
    }

    return new Date(b.geo.timestamp).getTime() - new Date(a.geo.timestamp).getTime();
  });
}

function applyFilters(rows, { category, status, sku }) {
  return rows.filter((item) => {
    if (category && item.tags !== category) {
      return false;
    }

    if (status && item.status !== status) {
      return false;
    }

    if (sku && !item.id.toLowerCase().includes(sku.toLowerCase())) {
      return false;
    }

    return true;
  });
}