# Download the data
Please request the data from the service administrator.
- pattern/en_patterns.json
- pattern/move_patterns.json

# Running the service
In the command line, enter
```bash
uvicorn pattern.writeahead:app --reload
```

The servies will be hosted at `localhost:8000` by default
