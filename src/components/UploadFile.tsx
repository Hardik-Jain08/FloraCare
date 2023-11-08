import Image from "next/image";

import { useIdentifyPlant } from "@/hooks/indentifyPlant";

export function UploadFile() {
	const {
		currentImage,
		disabled,
		error,
		loading,
		onImageChange,
		onClickHandler,
	} = useIdentifyPlant();

	return (
		<div className='flex items-center justify-center w-full py-12 flex-col'>
			<label className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer backdrop-blur-md hover:backdrop-blur-sm'>
				<div className='flex flex-col items-center justify-center pt-5 pb-6'>
					{!currentImage && (
						<>
							<svg
								className='w-8 h-8 mb-4 text-gray-100'
								aria-hidden='true'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 20 16'
							>
								<path
									stroke='currentColor'
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
								/>
							</svg>
							<p className='mb-2 text-sm text-gray-200'>
								<span className='font-semibold'>
									Click to upload
								</span>{" "}
								or drag and drop
							</p>
							<p className='text-xs text-gray-300'>
								SVG, PNG, JPG or GIF (MAX. 800x400px)
							</p>
						</>
					)}

					{currentImage && (
						<div className='flex flex-col items-center justify-center mt-4 space-y-2'>
							<Image
								src={URL.createObjectURL(currentImage)}
								alt='Plant Preview'
								className='w-32 h-32 rounded-md'
								width={256}
								height={256}
							/>
							<p className='text-xs text-gray-300 flex flex-col gap-1'>
								<span>{currentImage.name}</span>
								<span>
									({Math.round(currentImage.size / 1024)} KB)
								</span>
							</p>
						</div>
					)}
				</div>
				{loading && (
					<div className='relative w-full h-1 mt-4 bg-gray-200 rounded-full'>
						<div className='absolute top-0 left-0 h-full bg-[#6956a8] rounded-full animate-pulse'></div>
					</div>
				)}
				<input
					id='dropzone-file'
					type='file'
					className='hidden'
					onChange={onImageChange}
				/>
			</label>
			<button
				className='px-4 py-2 mt-4 text-sm font-medium text-[#6956a8] hover:text-[#7f69ce] bg-[#eadff8] rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full disabled:opacity-50 disabled:cursor-not-allowed'
				disabled={disabled}
				onClick={onClickHandler}
			>
				Upload
			</button>
		</div>
	);
}
