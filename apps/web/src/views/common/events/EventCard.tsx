'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { EventSummary } from '@book-my-ticket/common';
import { eventCategories } from '@/constants';
import { formatEventDate, formatMoney } from '@/utils/format';

export default function EventCard({ event }: { event: EventSummary }) {
  const category = eventCategories.find(item => item.value === event.category);

  return (
    <Paper
      component={Link}
      href={`/events/${event.slug}`}
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.14)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: '16 / 9',
          background: theme => theme.palette.gradients.cardConcert,
        }}
      >
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt=""
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        )}
        {category && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              color: 'common.white',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {category.label}
          </Box>
        )}
      </Box>
      <Stack spacing={0.75} sx={{ p: 2, flexGrow: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'primary.main',
            fontWeight: 800,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {formatEventDate(event.startDate, event.timezone)}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            lineHeight: 1.3,
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.name}
        </Typography>
        <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
          {`${event.venueName} · ${event.city}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.primary', fontWeight: 700, mt: 'auto', pt: 1 }}
        >
          {`From ${formatMoney(event.priceMin, event.currency)}`}
        </Typography>
      </Stack>
    </Paper>
  );
}
