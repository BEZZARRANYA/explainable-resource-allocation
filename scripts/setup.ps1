python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python db\init_db.py
Write-Host "Setup complete. Run: python app.py"

