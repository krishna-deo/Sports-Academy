export interface CountryCode {
  code: string;
  country: string;
  flag: string;
  label: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: '+91', country: 'India', flag: '🇮🇳', label: '🇮🇳 +91' },
  { code: '+1', country: 'United States', flag: '🇺🇸', label: '🇺🇸 +1' },
  { code: '+1-CA', country: 'Canada', flag: '🇨🇦', label: '🇨🇦 +1' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', label: '🇬🇧 +44' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', label: '🇦🇪 +971' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵', label: '🇳🇵 +977' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩', label: '🇧🇩 +880' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', label: '🇱🇰 +94' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦', label: '🇶🇦 +974' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', label: '🇸🇦 +966' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', label: '🇸🇬 +65' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', label: '🇦🇺 +61' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', label: '🇩🇪 +49' },
  { code: '+33', country: 'France', flag: '🇫🇷', label: '🇫🇷 +33' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', label: '🇯🇵 +81' },
  { code: '+86', country: 'China', flag: '🇨🇳', label: '🇨🇳 +86' },
  { code: '+7', country: 'Russia', flag: '🇷🇺', label: '🇷🇺 +7' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', label: '🇿🇦 +27' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', label: '🇧🇷 +55' }
];
