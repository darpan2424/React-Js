import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Button } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ButtonGroup size="small" aria-label="language selection">
      <Button
        onClick={() => changeLanguage('en')}
        variant={i18n.language === 'en' ? 'contained' : 'outlined'}
      >
        EN
      </Button>
      <Button
        onClick={() => changeLanguage('es')}
        variant={i18n.language === 'es' ? 'contained' : 'outlined'}
      >
        ES
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher; 