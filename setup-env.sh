#!/bin/bash

# Check if .env file exists
if [ -f .env ]; then
  echo "Warning: .env file already exists. Overwrite? (y/n)"
  read answer
  if [ "$answer" != "y" ]; then
    echo "Operation cancelled."
    exit 0
  fi
fi

# Create .env file with the API key
echo "Please enter your OpenAI API key:"
read api_key
echo "OPENAI_API_KEY=$api_key" > .env

echo ".env file created successfully with your OpenAI API key."
echo "Remember: Never commit this file to version control."
