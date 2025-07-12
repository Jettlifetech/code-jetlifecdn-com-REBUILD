#!/usr/bin/env python3
# search_script.py

import sys
import os
import datetime

def search_files(query, search_path):
    """
    Searches for files containing the query string within the specified path.
    """
    results = []
    total_files_searched = 0
    
    # Header for the report
    report_header = "File Path,Result\n"
    report_content = ""

    try:
        for root, _, files in os.walk(search_path):
            for file in files:
                total_files_searched += 1
                file_path = os.path.join(root, file)
                try:
                    # Avoid reading binary files by checking common text extensions
                    if file_path.endswith(('.txt', '.html', '.css', '.js', '.php', '.py', '.json', '.xml', '.md')):
                        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                            if query in f.read():
                                results.append(file_path)
                                report_content += f'"{file_path}",Found\n'
                except Exception:
                    # Could log errors for specific files if needed
                    continue
    except Exception as e:
        return f"Error during search: {str(e)}\n"

    # --- Generate Final Report ---
    final_report = f"--- Search Report ---\n"
    final_report += f"Date: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    final_report += f"Search Term: '{query}'\n"
    final_report += f"Directory Searched: '{search_path}'\n"
    final_report += f"---------------------\n\n"
    
    if results:
        final_report += f"Found {len(results)} instance(s) of '{query}':\n"
        final_report += "\n".join(results)
        final_report += "\n\n"
    else:
        final_report += f"No files found containing '{query}'.\n\n"

    final_report += f"--- Summary ---\n"
    final_report += f"Total files searched: {total_files_searched}\n"

    return final_report

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 search_script.py <query> <search_path>")
        sys.exit(1)

    search_query = sys.argv[1]
    path_to_search = sys.argv[2]

    # Security check: Prevent traversing to sensitive directories
    if '..' in path_to_search or not path_to_search.startswith('/'):
        print("Error: Invalid or insecure search path specified.")
        sys.exit(1)
    
    if not os.path.isdir(path_to_search):
        print(f"Error: The specified directory does not exist: {path_to_search}")
        sys.exit(1)

    report = search_files(search_query, path_to_search)
    print(report)