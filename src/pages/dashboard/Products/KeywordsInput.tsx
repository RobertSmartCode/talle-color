import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useKeywordsContext } from '../../../context/KeywordsContext'; 

interface KeywordsInputProps {
  initialKeywords?: string[];
}

const KeywordsInput: React.FC<KeywordsInputProps> = ({ initialKeywords }) => {
  const { keywords, updateKeywords } = useKeywordsContext()!;
  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    // Actualizar el contexto con las palabras clave iniciales
    if (initialKeywords) {
      updateKeywords(initialKeywords.map(keyword => keyword.toLowerCase()));
    }
  }, [initialKeywords]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value.toLowerCase());
  };

  const handleAddKeyword = () => {
    if (keyword) {
      const newKeywords = [...keywords, keyword];
      updateKeywords(newKeywords.map(keyword => keyword.toLowerCase()));
      setKeyword("");
    }
  };

  const handleDeleteKeyword = (index: number) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(index, 1);
    updateKeywords(updatedKeywords.map(keyword => keyword.toLowerCase()));
  };

  return (
    <div style={{ maxHeight: "600px"}}>
      <List>
        {keywords.map((keyword, index) => (
          <ListItem key={index}>
            <ListItemText primary={keyword} />
            <Button size="small" onClick={() => handleDeleteKeyword(index)}>
              <DeleteForeverIcon />
            </Button>
          </ListItem>
        ))}
      </List>

      <TextField
        variant="outlined"
        label="Keyword"
        value={keyword}
        onChange={handleKeywordChange}
        fullWidth
        sx={{
          width: '75%',
          margin: 'auto',
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddKeyword}
        startIcon={<AddCircleOutlineIcon />}
        sx={{
          width: '75%',
          margin: 'auto',
          marginTop: '8px',
        }}
      >
        Agregar Keyword
      </Button>
    </div>
  );
};

export default KeywordsInput;
