import os
import sys

def recover(input_dir):
	"""
	Loop through each file in the directory and attempt to save it with the correct file extension.
	"""
	os.chdir(input_dir)

	index = 0
	# Loop through each file in the directory
	for file_name in os.listdir():
		# Get the correct file extension
		extension = guess_extension(file_name)
		# If the file extension is not found, skip the file
		if extension is None:
			continue
		# Save the file with the correct file extension and an index as a new name
		new_file_name = f"{index}{extension}"
		os.rename(file_name, new_file_name)
		# Increment the index
		index += 1

	return index
		



def guess_extension(file_name):
	# Open the file and read the first 20 bytes
	with open(file_name, 'rb') as file:
		header = file.read(20)
	# Check for a GIF header
	if header[:6] in (b'GIF87a', b'GIF89a'):
		return '.gif'
	# Check for a PNG header
	elif header[:8] == b'\211PNG\r\n\032\n':
		return '.png'
	# Check for a JPEG header
	elif header[:2] == b'\377\330':
		return '.jpg'
	else:
		return None
	

if __name__ == "__main__":
	# get a command line argument for the input directory
	input_dir = sys.argv[1]
	# call the recover function
	successes = recover(input_dir)
	# print the number of successful recoveries
	print(f"Successfully recovered {successes} files.")
