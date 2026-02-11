import { useState, useEffect } from 'react';
import { WebsiteConfig } from '@/shared/components/types';

export function useWebsiteConfig() {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    
    // load config from localStorage
    const storedConfig = localStorage.getItem('websiteConfig');
    if (storedConfig) {
      try{
        const parsedConfig: WebsiteConfig = JSON.parse(storedConfig);
        setConfig(parsedConfig);
        setIsSetupComplete(true);
      }
      catch (error) {
        console.error('Error parsing website config from localStorage:', error);
      }
      
    }
  }, []);

  const saveConfig = (newConfig: WebsiteConfig) => {
    setConfig(newConfig);
    setIsSetupComplete(true);
    localStorage.setItem('websiteConfig', JSON.stringify(newConfig));
  }

  const resetConfig = () => {
    setConfig(null);
    setIsSetupComplete(false);
    localStorage.removeItem('websiteConfig');
  }

  const getCurrentDomain = (): string | undefined => {
    if (!config) return 'example.com'; // default domain for dummy data
    return config.useDummyData ? 'example.com' : (config.domain || 'example.com');
  }

  return {
    config,
    isSetupComplete,
    saveConfig,
    resetConfig,
    getCurrentDomain,
  };
}