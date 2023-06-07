function getDistro {
    if [ -f /etc/os-release ]; then
    # freedesktop.org and systemd
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
elif type lsb_release >/dev/null 2>&1; then
    # linuxbase.org
    OS=$(lsb_release -si)
    VER=$(lsb_release -sr)
elif [ -f /etc/lsb-release ]; then
    # For some versions of Debian/Ubuntu without lsb_release command
    . /etc/lsb-release
    OS=$DISTRIB_ID
    VER=$DISTRIB_RELEASE
elif [ -f /etc/debian_version ]; then
    # Older Debian/Ubuntu/etc.
    OS=Debian
    VER=$(cat /etc/debian_version)
elif [ -f /etc/SuSe-release ]; then
    # Older SuSE/etc.
    :
elif [ -f /etc/redhat-release ]; then
    # Older Red Hat, CentOS, etc.
    VER=$( cat /etc/redhat-release | cut -d" " -f3 | cut -d "." -f1)
    d=$( cat /etc/redhat-release | cut -d" " -f1 | cut -d "." -f1)
    if [[ $d == "CentOS" ]]; then
      OS="CentOS Linux"
    fi
else
    # Fall back to uname, e.g. "Linux <version>", also works for BSD, etc.
    OS=$(uname -s)
    VER=$(uname -r)
fi
}

getDistro

if [[ $OS == "Darwin" ]];
then
    echo "This script is not setup for your machine type:" $OS
    echo "Please use the manual steps described in https://github.com/Budibase/budibase/blob/develop/docs/CONTRIBUTING.md#getting-started-for-contributors"
    exit 1
fi


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