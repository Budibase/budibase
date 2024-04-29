FROM docker.io/pytorch/pytorch

RUN apt-get update -y && \
    apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-dev \
    git \
    # cleanup
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists

RUN python -m pip install easyocr flask
RUN python -c "import easyocr; easyocr.Reader(['en'])"

WORKDIR /app
ADD server.py /app/server.py
CMD ["python", "server.py"]
EXPOSE 8080