-- Add new vehicle profile fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN vehicle_color TEXT,
ADD COLUMN chassis_number TEXT,
ADD COLUMN designated_route TEXT;