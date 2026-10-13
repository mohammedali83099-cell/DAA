from setuptools import setup, find_packages

setup(
    name="thrml",
    version="1.0.0",
    description="THRML — DAA Algorithm Vulnerability & Stress-Testing Laboratory",
    author="Antigravity",
    packages=find_packages(),
    py_modules=["main"],
    install_requires=[
        "rich>=12.0.0"
    ],
    entry_points={
        "console_scripts": [
            "thrml=main:main",
        ],
    },
    python_requires=">=3.8",
)
