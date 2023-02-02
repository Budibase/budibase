# Install brew
if ! command -v brew &> /dev/null
then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install and setup asdf
if ! command -v asdf &> /dev/null
then
    brew install asdf

    if test -f ~/.bashrc; then
        echo -e "\n. $(brew --prefix asdf)/asdf.sh" >> ~/.bashrc
    fi

    if test -f ~/.zshrc; then
        echo -e "\n. $(brew --prefix asdf)/asdf.sh" >> ~/.zshrc
    fi
fi

# Install ASDF Plugins
asdf plugin add nodejs
asdf plugin add python

asdf install

npm install -g yarn