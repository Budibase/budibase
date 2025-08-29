#!/bin/bash

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# get the list of all .svelte files
svelte_files=$(find src -type f -name "*.svelte")

# Array to hold unused files
declare -a unused_files

echo -e "${NC}Scanning src folder to find all .svelte files"
echo -e "  ${GREEN}.${NC} means the .svelte is imported in another file"
echo -e "  ${RED}x${NC} means the .svelte is not imported and should likely be removed"

# loop over each svelte file
for svelte_file in $svelte_files
do
    # extract the filename
    filename=$(basename -- "$svelte_file")

    # skip files starting with '+'
    if [[ "$filename" == +* ]]
    then
        echo -n -e "${GREEN}.${NC}"
        continue
    fi

    # skip page files in /pages directories unless they look like components
    if [[ "$svelte_file" == *"/pages/"* ]]
    then
        # Page route files - always skip these as they're used by the router
        if [[ "$filename" == "index.svelte" || "$filename" == "_layout.svelte" || "$filename" == "_fallback.svelte" || "$filename" =~ ^\[.*\]\.svelte$ ]]
        then
            echo -n -e "${GREEN}.${NC}"
            continue
        fi
        
        # Component-like files in pages (typically in _components/ subdirs or PascalCase names)
        # Only check these if they look like reusable components
        if [[ "$svelte_file" == *"/_components/"* || "$filename" =~ ^[A-Z][A-Za-z]*\.svelte$ ]]
        then
            # These should be checked normally - fall through to import search
            :
        else
            # Other page files - assume they're route components, skip
            echo -n -e "${GREEN}.${NC}"
            continue
        fi
    fi

    # search for the filename in all files
    found=$(grep -rl "$filename" src)

    # if nothing was found, then the file is unused
    if [[ -z $found ]]
    then
        echo -n -e "${RED}x${NC}"
        unused_files+=("$svelte_file")
    else
        echo -n -e "${GREEN}.${NC}"
    fi
done

# Print a newline after progress dots
echo
echo 

# Print unused files
for file in "${unused_files[@]}"
do
    echo -e "${RED}Unused Svelte file: $file${NC}"
done

# If no unused components found, print the message and exit
if [ ${#unused_files[@]} -eq 0 ]; then
    echo -e "${GREEN}No unused components found.${NC}"
    exit 0
fi

# Delete files if user confirms
if [ ${#unused_files[@]} -gt 0 ]; then
    echo -e -n "${GREEN}Do you want to delete these ${#unused_files[@]} files? (y/n) ${NC}"
    read answer

    if [ "$answer" != "${answer#[Yy]}" ] ;then
        for file in "${unused_files[@]}"
        do
            rm "$file"
            echo -e "${RED}Deleted $file${NC}"
        done
    fi
fi