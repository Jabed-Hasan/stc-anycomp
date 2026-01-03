/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Container,
  IconButton,
  Badge,
  InputBase
} from '@mui/material';
import { Search, Notifications, MailOutline, KeyboardArrowDown, ImageNotSupported } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchPublishedSpecialists } from '@/lib/redux/slices/specialistsSlice';
import { getUser } from '@/lib/auth/authUtils';

export default function RegisterCompanyPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { specialists, loading } = useAppSelector((state) => state.specialists);

  const [priceFilter, setPriceFilter] = useState('Price');
  const [sortBy, setSortBy] = useState('Sort by');

  useEffect(() => {
    dispatch(fetchPublishedSpecialists({ page: 1, limit: 12 }));
  }, [dispatch]);

  // --- FILTERING LOGIC ---
  const filteredSpecialists = [...specialists].sort((a, b) => {
    if (priceFilter === 'low') return parseFloat(a.final_price) - parseFloat(b.final_price);
    if (priceFilter === 'high') return parseFloat(b.final_price) - parseFloat(a.final_price);
    if (sortBy === 'newest') return b.id - a.id; 
    if (sortBy === 'popular') return a.title.localeCompare(b.title);
    return 0;
  });

  const filterSelectStyles = {
    height: 40,
    borderRadius: 2,
    bgcolor: 'white',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000' },
    fontSize: '0.875rem',
    fontWeight: 500,
    minWidth: 120
  };

  const handlePriceChange = (e: any) => {
    setPriceFilter(e.target.value);
    if (e.target.value !== 'Price') setSortBy('Sort by');
  };

  const handleSortChange = (e: any) => {
    setSortBy(e.target.value);
    if (e.target.value !== 'Sort by') setPriceFilter('Price');
  };

  const handleProfileClick = () => {
    const user = getUser();
    if (user?.role === 'ADMIN') {
      router.push('/admin/specialists');
    } else if (user?.role === 'PROVIDER') {
      router.push('/specialists');
    }
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', color: '#111' }}>
      
      {/* --- HEADER --- */}
      <Box sx={{ borderBottom: '1px solid #F3F4F6', py: 1.5, bgcolor: 'white', position: 'sticky', top: 0, zIndex: 10 }}>
        {/* Changed to "lg" to match body width and create side gaps */}
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 50 }}>
            
            {/* 1. Logo */}
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: 0.5, color: '#111', mr: 2 }}>
              ANYCOMP
            </Typography>

            {/* 2. Nav Links (Center) */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 4, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              {['Register a company', 'Appoint a Company Secretary', 'Company Secretarial Services', 'How Anycomp Works'].map((text) => (
                <Typography 
                  key={text} 
                  variant="body2" 
                  fontWeight={500} 
                  sx={{ 
                    cursor: 'pointer', 
                    color: '#4B5563',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    '&:hover': { color: '#111' } 
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Box>

            {/* 3. Right Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
               {/* Search Bar */}
               <Box sx={{ 
                 display: { xs: 'none', md: 'flex' }, 
                 alignItems: 'center', 
                 border: '1px solid #E5E7EB', 
                 borderRadius: 1.5, 
                 pl: 1.5, 
                 pr: 0.5, 
                 py: 0.5,
                 width: 220,
                 bgcolor: '#F9FAFB'
               }}>
                 <InputBase 
                    placeholder="Search for any services" 
                    sx={{ fontSize: '0.75rem', flex: 1, color: '#333' }}
                 />
                 <Box sx={{ 
                   bgcolor: '#002F70', 
                   borderRadius: 1, 
                   display: 'flex', 
                   p: 0.5, 
                   cursor: 'pointer',
                   '&:hover': { bgcolor: '#001f4d' }
                 }}>
                    <Search sx={{ color: 'white', fontSize: 14 }} />
                 </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small"><MailOutline sx={{ color: '#4B5563', fontSize: 20 }} /></IconButton>
                <IconButton size="small">
                  <Badge badgeContent={1} color="error" variant="dot">
                    <Notifications sx={{ color: '#4B5563', fontSize: 20 }} />
                  </Badge>
                </IconButton>
                <IconButton size="small" onClick={handleProfileClick}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#eee', cursor: 'pointer' }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* --- MAIN CONTENT --- */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, color: '#6B7280', fontSize: '0.75rem' }}>
             <span>Home</span> / <span>Specialists</span> / <span style={{ color: '#111', fontWeight: 600 }}>Register a New Company</span>
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, letterSpacing: -0.5 }}>
          Register a New Company
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 5 }}>
          Get Your Company Registered with a Trusted Specialist
        </Typography>

        {/* --- FILTERS --- */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <FormControl size="small">
            <Select
              value={priceFilter}
              onChange={handlePriceChange}
              displayEmpty
              IconComponent={KeyboardArrowDown}
              sx={filterSelectStyles}
            >
              <MenuItem value="Price" disabled>Price</MenuItem>
              <MenuItem value="low">Low to High</MenuItem>
              <MenuItem value="high">High to Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={handleSortChange}
              displayEmpty
              IconComponent={KeyboardArrowDown}
              sx={filterSelectStyles}
            >
              <MenuItem value="Sort by" disabled>Sort by</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}><CircularProgress size={30} sx={{ color: '#002F70' }} /></Box>}

        {!loading && (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 3 
            }}
          >
            {filteredSpecialists.map((specialist) => (
              <Card
                key={specialist.id}
                onClick={() => router.push(`/specialist/${specialist.slug}`)}
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 3,
                  border: '1px solid transparent',
                  '&:hover': { boxShadow: '0px 10px 30px rgba(0,0,0,0.08)', borderColor: '#f0f0f0' },
                }}
              >
                {/* Image Container with Fixed Height */}
                <Box 
                  sx={{ 
                    height: 220,
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 3,
                    mb: 1.5,
                    bgcolor: '#f5f5f5'
                  }}
                >
                  {specialist.media && specialist.media.length > 0 && specialist.media[0]?.file_url ? (
                    <CardMedia
                      component="img"
                      image={specialist.media[0].file_url}
                      alt={specialist.title}
                      sx={{ 
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <Box sx={{ 
                      height: '100%', 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: '#9CA3AF'
                    }}>
                      <ImageNotSupported />
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column', '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: '#002F70' }}>
                      {specialist.title ? specialist.title.charAt(0) : 'A'}
                    </Avatar>
                    <Typography variant="caption" fontWeight={600} color="text.primary" sx={{ fontSize: '0.75rem' }}>Admin</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>- Company Secretary</Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={{
                      mb: 0.5,
                      fontSize: '0.95rem',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: 40 
                    }}
                  >
                    {specialist.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      fontSize: '0.8rem',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: 36
                    }}
                  >
                    {specialist.description}
                  </Typography>

                  <Typography variant="h6" fontWeight={800} color="#111" sx={{ mt: 'auto' }}>
                    RM {parseFloat(specialist.final_price).toLocaleString('en-US')}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {!loading && filteredSpecialists.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">No services found</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}