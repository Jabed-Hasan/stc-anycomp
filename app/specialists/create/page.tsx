'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { createSpecialist } from '@/lib/redux/slices/specialistsSlice';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Alert,
  CircularProgress,
  InputAdornment,
  Paper,
  IconButton,
  Checkbox,
  ListItemText,
  Drawer,
  Avatar,
  Divider,
  Chip,
  Snackbar
} from '@mui/material';
import { CloudUpload, Delete, Close, Verified } from '@mui/icons-material';

// --- MOCK DATA ---
const serviceOfferingsOptions = [
  { name: 'Incorporation of a new company', description: 'Complete company registration with SSM' },
  { name: 'Monthly Company Secretary subscription', description: 'Professional company secretary services' },
  { name: 'Opening of Bank Account', description: 'Assist with corporate bank account setup' },
  { name: 'Appointment of Secretary', description: 'Appoint qualified company secretary' },
  { name: 'Appointment/Resignation of Director', description: 'Director changes and notifications' },
  { name: 'Change of Nature of Business', description: 'Update business activities with SSM' },
  { name: 'Access Company Records and SSM Forms', description: '24/7 access to all company documents' },
  { name: 'Priority Filing', description: 'Fast-track document submission' },
  { name: 'Registered Office Address Use', description: 'Use our SSM-compliant address' },
];

const additionalOfferingsOptions = [
  { name: 'Company Secretary Subscription', description: 'Enjoy 1 month free Company Secretary Subscription' },
  { name: 'Opening of a Bank Account', description: 'Complimentary Corporate Bank Account Opening' },
  { name: 'Priority Filing', description: 'Documents are prioritized for submission and swift processing - within 24 hours' },
  { name: 'Registered Office Address Use', description: 'Use of SSM Compliant Registered Office Address with Optional Mail Forwarding' },
  { name: 'Access Company Records and SSM Forms', description: '24/7 Secure Access to Company Records and SSM Forms' },
  { name: 'Compliance Calendar Setup', description: 'Get automated reminders for all statutory deadlines' },
  { name: 'First Share Certificate Issued Free', description: 'Receive your company\'s first official share certificate at no cost' },
  { name: 'CTC Delivery & Courier Handling', description: 'Have your company documents and certified copies delivered securely to you' },
  { name: 'Chat Support', description: 'Always-On Chat Support for Compliance, Filing, and General Queries' },
];

const companyTypesOptions = [
  { name: 'Private Limited - Sdn. Bhd.', description: 'Most common choice for businesses in Malaysia' },
  { name: 'Public Limited - Bhd.', description: 'Suitable for large businesses planning to raise capital' },
  { name: 'Limited Liability Partnership (LLP)', description: 'Combines flexibility of partnership with limited liability' },
];

const currencies = [
  { code: 'MYR', symbol: 'RM', flag: '🇲🇾', name: 'Malaysian Ringgit' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'Singapore Dollar' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
];

export default function CreateSpecialistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.specialists);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState({
    title: 'Register a new company | Private Limited - Sdn Bhd',
    description: 'A company secretarial service founded by Grace, who believes that every company deserves clarity, confidence, and care in their compliance journey.',
    base_price: '1800',
    duration_days: '5',
    service_category: 'Incorporation of a new company',
    currency: 'MYR',
  });

  const [selectedServiceOfferings, setSelectedServiceOfferings] = useState<string[]>([]);
  const [selectedAdditionalOfferings, setSelectedAdditionalOfferings] = useState<string[]>(['Company Secretary Subscription']);
  const [selectedCompanyTypes, setSelectedCompanyTypes] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); 

  // --- HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3 - images.length);
      setImages([...images, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreviews((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.base_price || images.length === 0) {
        setSnackbar({ open: true, message: 'Please fill all required fields and upload at least one image', severity: 'error' });
        return;
      }

      // Prepare the data object matching backend API structure
      const dataPayload = {
        title: formData.title,
        description: formData.description,
        base_price: parseFloat(formData.base_price),
        duration_days: parseInt(formData.duration_days),
        service_category: formData.service_category,
        supported_company_types: selectedCompanyTypes.map(name => {
          const companyType = companyTypesOptions.find(ct => ct.name === name);
          return { 
            name, 
            description: companyType?.description || '' 
          };
        }),
        additional_offerings: selectedAdditionalOfferings.map(name => {
          const offering = additionalOfferingsOptions.find(o => o.name === name);
          return { 
            name, 
            description: offering?.description || '' 
          };
        }),
        service_offerings_data: selectedServiceOfferings.map(name => ({ name })),
        is_draft: true
      };

      // Create FormData for multipart/form-data
      const submitData = new FormData();
      
      // Add the data as JSON string
      submitData.append('data', JSON.stringify(dataPayload));
      
      // Add images with the field name 'media'
      images.forEach((image) => {
        submitData.append('media', image);
      });

      // Dispatch create action
      const result = await dispatch(createSpecialist(submitData)).unwrap();
      
      setSnackbar({ open: true, message: 'Specialist service created successfully!', severity: 'success' });
      
      // Redirect to specialists list after 2 seconds
      setTimeout(() => {
        router.push('/specialists');
      }, 2000);
      
    } catch (err: any) {
      setSnackbar({ open: true, message: err || 'Failed to create specialist service', severity: 'error' });
    }
  };

  const renderPriceRow = (label: string, value: string, bold = false) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
      <Typography variant="body2" color={bold ? 'text.primary' : 'text.secondary'} fontWeight={bold ? 600 : 400}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 8 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, md: 4 } }}>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* --- MAIN FLEX CONTAINER --- */}
        {/* Changed from Grid to Flexbox for better control with Sidebars */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, // Stacks on mobile, Side-by-side on Desktop
            gap: 6,
            alignItems: 'flex-start'
          }}
        >
          
          {/* ================= LEFT CONTENT AREA ================= */}
          {/* flex: 1 means it takes all available width left over */}
          <Box sx={{ flex: 1, width: '100%' }}>
            
            {/* 1. Title */}
            <Typography variant="h4" fontWeight={500} sx={{ mb: 3, color: '#1a1a1a' }}>
              {formData.title}
            </Typography>

            {/* 2. Image Grid (Hero Section) */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1.6fr 1fr' }, 
              gap: 2, 
              mb: 4,
              height: { xs: 'auto', sm: 400 },
              overflow: 'hidden' // Prevent layout shifts
            }}>
              {/* Large Left Image */}
              <Box sx={{ 
                bgcolor: '#F9FAFB', 
                borderRadius: 1, 
                position: 'relative', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: imagePreviews[0] ? 'none' : '1px dashed #ccc',
                minHeight: 200
              }}>
                {imagePreviews[0] ? (
                  <Box component="img" src={imagePreviews[0]} sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }} />
                ) : (
                  <Box sx={{ textAlign: 'center', color: '#9CA3AF' }}>
                    <CloudUpload sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                    <Typography variant="caption" display="block">Upload main image</Typography>
                  </Box>
                )}
              </Box>

              {/* Right Stacked Images */}
              <Box sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 2 }}>
                {[1, 2].map((idx) => (
                  <Box key={idx} sx={{ 
                    bgcolor: '#F9FAFB', 
                    borderRadius: 1, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: imagePreviews[idx] ? 'none' : '1px dashed #ccc',
                    minHeight: 100
                  }}>
                    {imagePreviews[idx] ? (
                      <Box component="img" src={imagePreviews[idx]} sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }} />
                    ) : (
                       <Typography variant="caption" color="text.secondary">Image {idx + 1}</Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* 3. Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Description</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {formData.description || 'Describe your service here'}
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 4. Additional Offerings */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Additional Offerings</Typography>
              <Typography variant="body2" color="text.secondary">
                Enhance your service by adding additional offerings
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* 5. Company Secretary Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>Company Secretary</Typography>
               <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: 3 }}>
                  {/* Profile Part - Left */}
                  <Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                       <Avatar sx={{ width: 80, height: 80, bgcolor: '#006C70' }}>GL</Avatar>
                       <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Typography variant="subtitle1" fontWeight={700}>Grace Lam</Typography>
                             <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#E0F2F1', px: 0.8, py: 0.2, borderRadius: 1 }}>
                                <Verified sx={{ fontSize: 14, color: '#00695C', mr: 0.5 }} />
                                <Typography variant="caption" sx={{ color: '#00695C', fontWeight: 600, fontSize: '0.65rem' }}>Verified</Typography>
                             </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary" display="block">Corpsec Services Sdn Bhd</Typography>
                          <Button 
                             variant="contained" 
                             size="small"
                             sx={{ mt: 1, bgcolor: '#111827', textTransform: 'none', fontSize: '0.7rem', py: 0.5, px: 2 }}
                          >
                             View Profile
                          </Button>
                       </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.875rem', lineHeight: 1.6 }}>
                       A company secretarial service founded by Grace, who believes that every company deserves clarity, confidence, and care in their compliance journey. Inspired by the spirit of entrepreneurship, Aida treats every client's business as if it were her own — attentive to detail, committed to deadlines, and focused on growth. Step into a partnership built on trust, transparency, and professional excellence. Whether you're just starting out or managing a growing company, Aida is here to make your corporate governance smooth, secure, and stress-free. Your company's peace of mind starts here
                    </Typography>
                  </Box>

                  {/* Certifications Part - Right */}
                  <Box>
                     <Typography variant="subtitle2" fontWeight={600} gutterBottom>Certified Company Secretary</Typography>
                     <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
                        <Box 
                          component="img"
                          src="/placeholder-cert-1.png"
                          alt="SSM Certification"
                          sx={{ 
                            width: 80, 
                            height: 50, 
                            bgcolor: '#f0f0f0', 
                            borderRadius: 1,
                            objectFit: 'contain',
                            border: '1px solid #e0e0e0'
                          }} 
                        />
                        <Box 
                          component="img"
                          src="/placeholder-cert-2.png"
                          alt="MAICSA Certification"
                          sx={{ 
                            width: 80, 
                            height: 50, 
                            bgcolor: '#f0f0f0', 
                            borderRadius: 1,
                            objectFit: 'contain',
                            border: '1px solid #e0e0e0'
                          }} 
                        />
                        <Box 
                          component="img"
                          src="/placeholder-cert-3.png"
                          alt="Additional Certification"
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            bgcolor: '#f0f0f0', 
                            borderRadius: 1,
                            objectFit: 'contain',
                            border: '1px solid #e0e0e0'
                          }}
                        />
                     </Box>
                  </Box>
               </Box>
            </Box>
          </Box>

          {/* ================= RIGHT SIDEBAR ================= */}
          {/* Fixed width on Desktop (380px), Full width on Mobile */}
          <Box sx={{ 
            width: { xs: '100%', md: 380 }, 
            flexShrink: 0 
          }}>
            
            {/* A. Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mb: 3 }}>
              <Button
                variant="contained"
                onClick={() => setDrawerOpen(true)}
                sx={{ 
                  bgcolor: '#111827', color: 'white', textTransform: 'none',
                  '&:hover': { bgcolor: '#374151' }
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                onClick={handlePublish}
                disabled={loading}
                sx={{
                  bgcolor: '#002F70', textTransform: 'none',
                  '&:hover': { bgcolor: '#001f4d' },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Publish'}
              </Button>
            </Box>

            {/* B. Professional Fee Card */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 0, boxShadow: '0px 4px 24px rgba(0,0,0,0.06)', bgcolor: 'white' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: '1.2rem' }}>
                Professional Fee
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Set a rate for your service
              </Typography>

              {/* Price with underline */}
              <Box sx={{ mb: 4, display: 'inline-block' }}>
                 <Typography variant="h4" fontWeight={600} sx={{ lineHeight: 1, mb: 1 }}>
                   RM {formData.base_price ? parseFloat(formData.base_price).toLocaleString('en-US') : '0'}
                 </Typography>
                 <Box sx={{ height: 3, bgcolor: '#000', width: '100%' }} />
              </Box>
              
              {/* Fee Breakdown */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {renderPriceRow('Base price', `RM ${parseFloat(formData.base_price || '0').toLocaleString()}`)}
                {renderPriceRow('Service processing fee', `RM ${(parseFloat(formData.base_price || '0') * 0.3).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`)}
                
                <Divider sx={{ my: 1.5 }} />
                
                {renderPriceRow('Total', `RM ${(parseFloat(formData.base_price || '0') * 1.3).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, true)}
                
                <Box sx={{ mt: 2 }}>
                   {renderPriceRow('Your returns', `RM ${parseFloat(formData.base_price || '0').toLocaleString()}`, true)}
                </Box>
              </Box>
            </Paper>

          </Box>
        </Box>
      </Box>

      {/* --- EDIT DRAWER --- */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ 
          '& .MuiDrawer-paper': { 
            width: { xs: '100%', sm: 500, md: 600 }, 
            p: 0,
            maxWidth: '100vw' // Prevent drawer from exceeding viewport
          } 
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 3, 
            borderBottom: '1px solid #e0e0e0' 
          }}>
            <Typography variant="h6" fontWeight={600}>Edit Service</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Drawer Content - Scrollable */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            overflowX: 'hidden', // Prevent horizontal scroll
            p: { xs: 2, sm: 3 }, // Responsive padding
            WebkitOverflowScrolling: 'touch' // Smooth scrolling on mobile
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* Title */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Title
                </Typography>
                <TextField
                  fullWidth
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter service title"
                  size="small"
                />
              </Box>

              {/* Description */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Description <Typography component="span" color="error">*</Typography>
                </Typography>
                <TextField
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Describe your service here"
                  inputProps={{ maxLength: 2000 }}
                  helperText={`${formData.description.length}/2000 words`}
                  required
                />
              </Box>

              {/* Estimated Completion Time */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Estimated Completion Time (Days) <Typography component="span" color="error">*</Typography>
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="duration_days"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    required
                  >
                    {[...Array(30)].map((_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1} day{i > 0 ? 's' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Price with Currency Selector */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Price <Typography component="span" color="error">*</Typography>
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl sx={{ minWidth: 140 }} size="small">
                    <Select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      {currencies.map((curr) => (
                        <MenuItem key={curr.code} value={curr.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>{curr.flag}</span>
                            <span>{curr.code}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    name="base_price"
                    type="number"
                    value={formData.base_price}
                    onChange={handleChange}
                    size="small"
                    placeholder="0.00"
                    required
                    inputProps={{ min: 0, step: '0.01' }}
                  />
                </Box>
              </Box>

              {/* Service Offerings */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Service Offerings
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={selectedServiceOfferings}
                    onChange={(e) => setSelectedServiceOfferings(e.target.value as string[])}
                    displayEmpty
                    renderValue={(selected) =>
                      selected.length === 0 ? 'Select service offerings' : `${selected.length} selected`
                    }
                  >
                    {serviceOfferingsOptions.map((option) => (
                      <MenuItem key={option.name} value={option.name}>
                        <Checkbox checked={selectedServiceOfferings.includes(option.name)} />
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Show selected service offerings */}
                {selectedServiceOfferings.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {selectedServiceOfferings.map((name) => {
                      const offering = serviceOfferingsOptions.find((o) => o.name === name);
                      return (
                        <Box 
                          key={name} 
                          sx={{ 
                            mb: 1.5, 
                            p: 1.5, 
                            bgcolor: '#f5f5f5', 
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1
                          }}
                        >
                          <Checkbox checked readOnly size="small" sx={{ p: 0, mt: 0.5 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {offering?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {offering?.description}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>

              {/* Additional Offerings */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Additional Offerings
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={selectedAdditionalOfferings}
                    onChange={(e) => setSelectedAdditionalOfferings(e.target.value as string[])}
                    displayEmpty
                    renderValue={(selected) =>
                      selected.length === 0 ? 'Select additional offerings' : `${selected.length} selected`
                    }
                  >
                    {additionalOfferingsOptions.map((option) => (
                      <MenuItem key={option.name} value={option.name}>
                        <Checkbox checked={selectedAdditionalOfferings.includes(option.name)} />
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Show selected offerings with descriptions */}
                {selectedAdditionalOfferings.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {selectedAdditionalOfferings.map((name) => {
                      const offering = additionalOfferingsOptions.find((o) => o.name === name);
                      return (
                        <Box 
                          key={name} 
                          sx={{ 
                            mb: 1.5, 
                            p: 1.5, 
                            bgcolor: '#f5f5f5', 
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1
                          }}
                        >
                          <Checkbox checked readOnly size="small" sx={{ p: 0, mt: 0.5 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {offering?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {offering?.description}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>

              {/* Supported Company Types */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Supported Company Types
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={selectedCompanyTypes}
                    onChange={(e) => setSelectedCompanyTypes(e.target.value as string[])}
                    displayEmpty
                    renderValue={(selected) =>
                      selected.length === 0 ? 'Select company types' : `${selected.length} selected`
                    }
                  >
                    {companyTypesOptions.map((option) => (
                      <MenuItem key={option.name} value={option.name}>
                        <Checkbox checked={selectedCompanyTypes.includes(option.name)} />
                        <ListItemText primary={option.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Show selected company types */}
                {selectedCompanyTypes.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {selectedCompanyTypes.map((name) => {
                      const companyType = companyTypesOptions.find((ct) => ct.name === name);
                      return (
                        <Box 
                          key={name} 
                          sx={{ 
                            mb: 1.5, 
                            p: 1.5, 
                            bgcolor: '#f5f5f5', 
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1
                          }}
                        >
                          <Checkbox checked readOnly size="small" sx={{ p: 0, mt: 0.5 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {companyType?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {companyType?.description}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>

              {/* Service Category */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Service Category <Typography component="span" color="error">*</Typography>
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="service_category"
                    value={formData.service_category}
                    onChange={(e) => setFormData({ ...formData, service_category: e.target.value })}
                    displayEmpty
                    required
                  >
                    <MenuItem value="" disabled>Select category</MenuItem>
                    <MenuItem value="Incorporation of a new company">Incorporation of a new company</MenuItem>
                    <MenuItem value="Monthly Company Secretarial subscription">Monthly Company Secretarial subscription</MenuItem>
                    <MenuItem value="Opening of Bank Account">Opening of Bank Account</MenuItem>
                    <MenuItem value="Appointment of Secretary">Appointment of Secretary</MenuItem>
                    <MenuItem value="Appointment/Resignation of Director">Appointment/Resignation of Director</MenuItem>
                    <MenuItem value="Change of Nature of Business">Change of Nature of Business</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Service Images */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Service Images (Max 3) <Typography component="span" color="error">*</Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Accepted formats: JPG, PNG, WebP • Max size: 5MB per image
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  disabled={images.length >= 3}
                  fullWidth
                  sx={{ 
                    mb: 2, 
                    textTransform: 'none',
                    borderColor: '#e0e0e0',
                    color: 'text.secondary',
                    '&:hover': { borderColor: '#002F70', color: '#002F70' }
                  }}
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                  />
                </Button>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, 
                    gap: 1,
                    width: '100%',
                    overflow: 'hidden' // Prevent image preview overflow
                  }}>
                    {imagePreviews.map((preview, index) => (
                      <Box key={index} sx={{ position: 'relative', paddingTop: '100%', width: '100%' }}>
                        <Box
                          component="img"
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                            maxWidth: '100%' // Prevent image overflow
                          }}
                        />
                        {/* Image info overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            p: 0.5,
                            fontSize: '0.65rem',
                          }}
                        >
                          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                            {images[index]?.name.substring(0, 15)}...
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ fontSize: '0.6rem' }}>
                            {(images[index]?.size / 1024).toFixed(0)} KB
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                            width: 24,
                            height: 24
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

            </Box>
          </Box>

          {/* Drawer Footer - Fixed at bottom */}
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            borderTop: '1px solid #e0e0e0', 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            bgcolor: 'white',
            flexShrink: 0 // Prevent footer from shrinking
          }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setDrawerOpen(false)}
              sx={{ 
                textTransform: 'none',
                borderColor: '#e0e0e0',
                color: 'text.secondary'
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                // Handle save/confirm logic here
                setDrawerOpen(false);
              }}
              sx={{
                bgcolor: '#002F70',
                '&:hover': { bgcolor: '#001f4d' },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}