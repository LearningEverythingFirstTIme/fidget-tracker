'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FIDGET_BRANDS } from '@/lib/brands';
import { ChevronLeft, Save, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  children: { id: string; name: string }[];
}

interface Item {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  pricePaid: number | null;
  currentValue: number | null;
  status: string;
  condition: string | null;
  categoryId: string;
  category: { name: string } | null;
  material: string | null;
  description: string | null;
  quantity: number | null;
  weightGrams: number | null;
  dimensions: string | null;
  purchaseSource: string | null;
  notes: string | null;
}

